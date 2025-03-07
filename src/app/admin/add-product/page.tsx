"use client";

import AdminProductForm from "../../components/AdminProductForm";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="max-w-2xl mx-auto ">
        <h1 className="text-3xl font-bold mb-8">Admin</h1>
        <AdminProductForm />
      </div>
    </div>
  );
}