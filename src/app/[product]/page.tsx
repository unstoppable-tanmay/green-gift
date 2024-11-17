"use client";
import { use } from "react";
import Product from "@/pages/product";

const ProductPage = ({ params }: { params: Promise<{ product: string }> }) => {
  const { product } = use(params);
  return <Product id={product} />;
};

export default ProductPage;
