import { IProduct } from "@/model/productModel"
import { Types } from "mongoose";

export type ProductFormData = Omit<IProduct, "_id">;

export interface CreateOrderData {
    productId: Types.ObjectId | string;
}

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    headers: Record<string, string>
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options

        const defaultHeader = {
            "Content-Type": "application/json",
            ...headers
        }

        const response: Response = await fetch(endpoint, {
            method,
            body: JSON.stringify(body),
            headers: defaultHeader
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        return response.json()
    }

    async getProducts() {
        return this.fetch<IProduct[]>("/api/products", { method: "GET", headers: {} })
    }

    async getProduct(id: string) {
        return this.fetch<IProduct>(`/api/products/${id}`, { method: "GET", headers: {} })
    }

    async createProduct(productData: ProductFormData) {
        return this.fetch<IProduct>("/api/products", { method: "POST", body: productData, headers: {} })
    }

    async createOrder(orderData: CreateOrderData) {
        const sanitizedOrderData = {
            ...orderData,
            productId: orderData.productId.toString(),
        };

        return this.fetch<{ orderId: string; amount: number }>("/orders", {
            method: "POST",
            body: sanitizedOrderData,
            headers: {}
        })
    }
}

export const apiClient = new ApiClient()