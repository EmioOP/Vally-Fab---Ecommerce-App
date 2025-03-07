"use client";

import { useState, useEffect } from "react";
import { IProduct } from "@/model/productModel";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=4");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen bg-base-100">
       <Navbar/>

      {/* Hero Section */}
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: "url(/fabric-bg.jpg)" }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <h1 className="mb-5 text-5xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Premium Fabrics & Fashion
            </h1>
            <p className="mb-5 text-xl">
              Discover exquisite fabrics that transform your fashion dreams into
              reality. Quality materials for designers and enthusiasts alike.
            </p>
            <Link
              href={"/products"}
              className="btn btn-primary hover:bg-slate-500"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="py-24 px-4 md:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Silk", "Cotton", "Linen"].map((category) => (
            <div
              key={category}
              className="card image-full hover:scale-105 transition-transform"
            >
              <figure>
                <img
                  src={`https://img.freepik.com/free-photo/fashion-woman-with-clothes_1203-8302.jpg?t=st=1741259026~exp=1741262626~hmac=9779fe656b8cc3d4002ee59ebba329163b438a18d58dac0a4f95a2a4bf355cf3&w=740`}
                  alt={category}
                />
              </figure>
              <div className="card-body justify-end">
                <h3 className="card-title text-3xl text-white">{category}</h3>
                <button className="btn btn-ghost text-white">Shop Now →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-24 bg-base-200">
        <div className="px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id?.toString()}
                className="card bg-base-100 shadow-xl"
              >
                <figure className="px-4 pt-4">
                  <img
                    src={product.image}
                    alt="Product"
                    className="rounded-xl h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">
                    ₹{product.price}
                  </p>
                  <div className="card-actions">
                    <Link  href={`/products/${product._id}`} className="btn btn-primary hover:bg-slate-400 w-full">
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Summer Sale!</h3>
          <p className="text-xl mb-8">Up to 50% off selected fabrics</p>
          <button className="btn btn-accent btn-lg">Shop Sale</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <div>
          <span className="footer-title">Valley's Fabrics</span>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Careers</a>
        </div>
        <div>
          <span className="footer-title">Customer Service</span>
          <a className="link link-hover">Shipping Policy</a>
          <a className="link link-hover">Returns</a>
          <a className="link link-hover">FAQ</a>
        </div>
        <div>
          <span className="footer-title">Follow Us</span>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
