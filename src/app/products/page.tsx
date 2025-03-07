"use client";
import { IProduct } from "@/model/productModel";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <header className="fixed w-full top-0 left-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
        <Navbar />
      </header>
      
      <div className="container mx-auto p-4 min-h-screen max-h-full mt-20">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Trending Now
        </h1>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card bg-base-100 dark:bg-gray-800 shadow-xl">
                <figure className="px-4 pt-4 relative overflow-hidden">
                  <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </figure>
                <div className="card-body">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4 animate-pulse"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products?.map((product) => (
              <div 
                key={product._id?.toString()}
                className="card bg-base-100 dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <figure className="px-4 pt-4 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-xl h-60 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-6 right-6 badge badge-accent">
                    Latest
                  </div>
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-xl">{product.name}</h2>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-2xl font-bold text-primary">
                      ₹{product.price}
                    </p>
                    <Link 
                      href={`/products/${product._id}`}
                      className="btn btn-primary btn-outline hover:btn-primary hover:-translate-y-1 transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-2xl font-bold mb-4">No products found</div>
            <p className="text-gray-500 dark:text-gray-300">
              Check back later for our latest collections!
            </p>
          </div>
        )}
      </div>
    </>
  );
}