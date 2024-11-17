"use client";
import { use } from "react";

const OrderItem = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return <div className=""></div>;
};

export default OrderItem;
