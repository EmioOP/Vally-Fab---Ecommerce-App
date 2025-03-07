"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IProduct } from "@/model/productModel";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4 min-h-screen max-h-full mt-6">
    <h1 className="text-xl font-bold mb-4 text-left ml-2">All Products</h1>
    <ul className="flex flex-wrap gap-4">
      {products?.map((product) => (
        <li
          key={product._id?.toString()}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4"
        >
          <Link href={`/admin/products/${product._id}`}>
            <div className="border p-4 rounded-lg shadow flex flex-col md:flex-row items-center">
              {/* Image Section */}
              <div className="w-full md:w-1/3 h-32 md:h-auto overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
  
              {/* Product Details Section */}
              <div className="w-full md:w-2/3 md:pl-4 mt-4 md:mt-0">
                <h2 className="text-lg font-semibold truncate">
                  {product.name}
                </h2>
                <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                  {product.description}
                </p>
                <p className="text-gray-800 mt-2 text-sm">
                  <strong>Price:</strong> ₹{product.price}
                </p>
                <p className="text-gray-800 mt-2 text-sm">
                  <strong>Category:</strong> {product.category}
                </p>
                <p className="text-gray-800 mt-2 text-sm">
                  <strong>Size:</strong> {product.sizes}
                </p>
                <p className="text-gray-800 mt-2 text-sm">
                  <strong>Brand:</strong> {product.brand}
                </p>
  
                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                  <Link href={`/admin/update-product/${product._id}`}>
                    <button className="btn btn-soft btn-secondary">
                      Update
                    </button>
                  </Link>
                  <Link href={`/products/delete-product/${product._id}`}>
                    <button className="btn btn-soft btn-danger">
                      Delete
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  

  );
}
