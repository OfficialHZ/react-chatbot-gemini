// src/components/ProductCard.js
import React from "react";

const ProductCard = ({ product }) => (
  <div className="border rounded-lg shadow-lg p-4 text-center">
    <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-2" />
    <h3 className="font-bold text-lg">{product.name}</h3>
    <p className="text-gray-500">${product.price}</p>
    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Add to Cart</button>
  </div>
);

export default ProductCard;
