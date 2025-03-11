import React from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Admin() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <div>
        <h1 className="text-2xl text-center my-2">Admin</h1>
      </div>

      <div className="flex flex-wrap">

      <div className="min-h-full p-6 flex">
        <div className="card w-96 bg-base-100 card-md shadow-sm ">
          <div className="card-body">
            <h2 className="card-title">Products</h2>
            <p>
              List all the products in the databse, create a new product, update
              any exsisting product, delete any product
            </p>
            <div className="justify-end card-actions">
              <Link href={'/admin/products'}>
                <button className="btn btn-primary">Go to Products</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-full p-6 flex">
        <div className="card w-96 bg-base-100 card-md shadow-sm ">
          <div className="card-body">
            <h2 className="card-title">Categories</h2>
            <p>
              List all the Categories in the databse, create a new category, update
              any exsisting category, delete any category,and list all the product which a category is having
            </p>
            <div className="justify-end card-actions">
              <Link href={'/admin/categories'}>
                <button className="btn btn-primary">Go to Categories</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      </div>
    
    </>
  );
}
