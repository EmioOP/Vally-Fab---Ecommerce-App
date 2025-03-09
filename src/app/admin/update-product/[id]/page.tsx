"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FileUpload from "@/app/components/FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { IProduct } from "@/model/productModel";


export default function EditProductForm() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    sizes: "M",
    stock: 0,
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch product");
        }

        setFormData({
          ...data.product,
          price: data.product.price , // Assuming price is stored in cents
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.brand ||
      !formData.sizes ||
      typeof formData.stock === "undefined" ||
      !formData.image
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setUpdating(true)
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Math.round(formData.price ),
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      setSuccess("Product updated successfully!");
      setUpdating(false)
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      setUpdating(false)
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setFormData((prev) => ({ ...prev, image: response.filePath }));
    setSuccess("Image uploaded successfully!");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700">{success}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          />
        </div>
        <div>
          <label className="block mb-2">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Size</label>
          <select
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Product Image</label>
          {formData.image && (
            <img
              src={formData.image.startsWith("http") ? formData.image:`https://ik.imagekit.io/bufohim2jd${formData.image}`}
              alt="Product Preview"
              className="w-32 h-32 object-cover rounded-lg border mb-2"
            />
          )}
          <FileUpload onSuccess={handleUploadSuccess} />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {updating? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
