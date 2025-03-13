"use client";

import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient, ProductFormData } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { ICategory } from "@/model/categoryModel";

function FormInput({
  label,
  error,
  children,
  id,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium" aria-required={!!error}>
          {label}
        </span>
      </label>
      {children}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

export default function AdminProductForm() {
  const { showNotification } = useNotification();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: [],
      brand: "",
      sizes: "M",
      image: "",
      stock: 0,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        showNotification("Failed to load categories", "error");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [showNotification]);

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("image", response.filePath);
    showNotification("Image uploaded successfully!", "success");
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setValue("sizes", size);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");
      reset({
        name: "",
        description: "",
        price: 0,
        category: "",
        brand: "",
        sizes: "M",
        image: "",
        stock: 0,
      });
      setSelectedSize("M");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create product",
        "error"
      );
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg dark:bg-base-300 dark:text-base-content">
      <h1 className="text-xl font-bold mb-8 text-center">Add New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Product Name"
            error={errors.name?.message}
            id="name"
          >
            <input
              id="name"
              type="text"
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              placeholder="Enter product name"
              {...register("name", {
                required: "Name is required",
                maxLength: { value: 100, message: "Maximum 100 characters" },
              })}
            />
          </FormInput>

          <FormInput label="Price ($)" error={errors.price?.message} id="price">
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              className={`input input-bordered w-full ${
                errors.price ? "input-error" : ""
              }`}
              placeholder="0.00"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0.01, message: "Price must be at least $0.01" },
                max: { value: 10000, message: "Maximum price is $10,000" },
              })}
            />
          </FormInput>

          <FormInput
            label="Category"
            error={errors.category?.message}
            id="category"
          >
            <select
              id="category"
              className={`select select-bordered w-full ${
                errors.category ? "select-error" : ""
              }`}
              disabled={loadingCategories || categories.length === 0}
              {...register("category", { required: "Category is required" })}
            >
              {loadingCategories ? (
                <option disabled>Loading categories...</option>
              ) : categories.length === 0 ? (
                <option disabled>No categories available</option>
              ) : (
                <>
                  <option value="">Select a category</option>
                  {categories.map((category: ICategory) => (
                    <option key={category._id.toString()} value={(category._id).toString()}>
                      {category.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </FormInput>

          <FormInput label="Brand" error={errors.brand?.message} id="brand">
            <input
              id="brand"
              type="text"
              className={`input input-bordered w-full ${
                errors.brand ? "input-error" : ""
              }`}
              placeholder="Enter brand name"
              autoComplete="organization"
              {...register("brand", {
                required: "Brand is required",
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
          </FormInput>

          <FormInput label="Stock" error={errors.stock?.message} id="stock">
            <input
              id="stock"
              type="number"
              min="0"
              className={`input input-bordered w-full ${
                errors.stock ? "input-error" : ""
              }`}
              placeholder="Enter stock quantity"
              {...register("stock", {
                required: "Stock is required",
                valueAsNumber: true,
                min: { value: 0, message: "Stock cannot be negative" },
              })}
            />
          </FormInput>

          <FormInput
            label="Available Sizes"
            error={errors.sizes?.message}
            id="sizes"
          >
            <div className="flex flex-wrap gap-4">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sizes"
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => handleSizeChange(size)}
                    className="radio radio-primary"
                  />
                  <span className="font-medium">{size}</span>
                </label>
              ))}
            </div>
          </FormInput>
        </div>

        <FormInput
          label="Description"
          error={errors.description?.message}
          id="description"
        >
          <textarea
            id="description"
            className={`textarea textarea-bordered w-full h-32 ${
              errors.description ? "textarea-error" : ""
            }`}
            placeholder="Enter product description"
            {...register("description", {
              required: "Description is required",
              maxLength: { value: 500, message: "Maximum 500 characters" },
            })}
          />
        </FormInput>

        <FormInput
          label="Product Image"
          error={errors.image?.message}
          id="image"
        >
          <div className="space-y-4">
            <FileUpload onSuccess={handleUploadSuccess} />
            {watch("image") && (
              <div className="mt-4 animate-fade-in">
                <p className="text-sm text-success mb-2">Image uploaded!</p>
                <img
                  src={`${baseUrl}/${watch("image").split("/").pop()}`}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </FormInput>

        <button
          type="submit"
          className="btn btn-primary w-full mt-8"
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Creating product" : "Create product"}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Product...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
}