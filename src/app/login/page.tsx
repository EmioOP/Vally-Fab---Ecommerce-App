"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification";
import Link from "next/link";
import Input from "../components/ui/Input";
import { useSession } from "next-auth/react"

export default function Login() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });


    if (result?.error) {
      showNotification(result.error, "error");
      setLoading(false);
    } else {
      showNotification("Login successful!", "success");
      session?.user?.role === "admin" ? router.push("/admin") : router.push("/");
      setLoading(false);
    }
  };

  // Email icon SVG
  const emailIcon = (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  // Password icon SVG
  const passwordIcon = (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  return (
    <main className="overflow-hidden max-h-screen dark:bg-gray-900">
      <div className="min-h-screen flex items-start justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl my-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-300">
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              required
              icon={emailIcon}
            />

            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              required
              icon={passwordIcon}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.01] shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? "Signing You in..." : "Sign In"}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}