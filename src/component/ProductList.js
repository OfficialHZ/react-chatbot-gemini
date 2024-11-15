// src/components/ProductList.js
import React from "react";
import ProductCard from "./ProductCard";
import products from "../data/products";

const ProductList = () => (
  <div className="p-4">
    <h1 className="text-xl font-bold mb-3">Corner Shop</h1>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export default ProductList;
