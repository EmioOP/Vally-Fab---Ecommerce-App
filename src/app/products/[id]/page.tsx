"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import Navbar from "@/app/components/Navbar";
import { IProduct } from "@/model/productModel";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // Implement cart functionality here
    alert(`Added ${quantity} ${product?.name} to cart`);
  };

  const handleBuyNow = () => {
    // Implement checkout redirect here
    router.push("/checkout");
  };

  if (loading) {
    return (
      <>
        <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-sm">
          <Navbar />
        </header>
        <div className="container mx-auto p-4 min-h-screen flex items-center justify-center mt-16">
          <div className="animate-pulse text-xl">Loading product...</div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-sm">
          <Navbar />
        </header>
        <div className="container mx-auto p-4 min-h-screen flex items-center justify-center mt-16">
          <div className="text-red-500 text-xl">{error || "Product not found"}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>

      <div className="container mx-auto p-4 min-h-screen mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="flex flex-col gap-4">
            <div className="border rounded-lg overflow-hidden h-[400px] relative">
              {product.image ? (
                <div className="relative w-full h-full overflow-hidden">
                {/* Blurred Background */}
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="absolute inset-0 object-cover blur-md scale-110"
                  aria-hidden="true"
                />
                
                {/* Main Image */}
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="relative object-contain z-10"
                  priority
                />
              </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No image available
                </div>
              )}
            </div>
            
            {/* Thumbnails - if you have multiple images */}
            <div className="grid grid-cols-4 gap-2">
              {[product.image, "/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"].map((src, index) => (
                <div key={index} className="border rounded-lg overflow-hidden h-24 relative cursor-pointer hover:border-blue-500">
                  <Image
                    src={src || "/placeholder.svg?height=100&width=100"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(120 reviews)</span>
              </div>
            </div>

            <div className="text-2xl font-bold">₹{product.price}</div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">
                {product.description || "No description available for this product. This premium product offers exceptional quality and value."}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className={`w-12 h-12 rounded-md border ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center"
                  onClick={() => handleQuantityChange("decrease")}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                  {quantity}
                </div>
                <button
                  className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center"
                  onClick={() => handleQuantityChange("increase")}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
              <button
                className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-md flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="hidden sm:flex items-center justify-center w-12 h-12 border border-gray-300 rounded-md hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Share2 className="w-4 h-4" />
                <span>Share this product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                Product Details
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Reviews
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Shipping & Returns
              </button>
            </nav>
          </div>
          <div className="py-6">
            <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Material</h4>
                <p className="text-gray-600">Premium quality cotton</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Care Instructions</h4>
                <p className="text-gray-600">Machine wash cold, tumble dry low</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Country of Origin</h4>
                <p className="text-gray-600">India</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Warranty</h4>
                <p className="text-gray-600">30 days warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
