"use client";

import { useAuth } from "@/provider/auth-provider/auth-provider";
import { ResponseType } from "@/types/common-types";
import {
  Address,
  Order,
  OrderItem as OrderItemType,
  Product,
  ShipMent,
} from "@prisma/client";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const OrderItem = ({
  order,
  ind,
}: {
  ind: number;
  order: Order & {
    address: Address;
    items: (OrderItemType & { product: Product })[];
    ShipMent: ShipMent[];
  };
}) => {
  return (
    <div className="flex w-[clamp(200px,700px,95vw)] sm:w-[clamp(200px,700px,90vw)] mx-auto mt-3 rounded-2xl bg-gray-100 p-4 flex-col gap-3">
      <div className="flex justify-between">
        <div className="heading text-xl font-medium">Order {ind}</div>
        <div className="total text-3xl text-green-900 font-medium">
          ₹{order.totalAmount}
        </div>
      </div>
      {order.items.map((item) => (
        <div className="flex gap-2 w-full" key={item.id}>
          <div className="img aspect-square rounded-xl overflow-hidden">
            <img
              src={item.product.images[0]}
              alt=""
              className="w-[100px] aspect-square object-cover"
            />
          </div>
          <div className="details flex gap-2 justify-between items-center flex-1">
            <div className="flex flex-col gap-1">
              <div className="name text-lg font-medium line-clamp-1  max-w-[200px]">
                {item.product.name}
              </div>
              <div className="name text-xs line-clamp-2 max-w-[200px]">
                {item.product.description}
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              <div className="price text-xl font-medium">
                {item.product.price}
              </div>
              <div className="quantity">{item.quantity} Items </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex">
        <div className="status ">Status: {order.ShipMent[0]?.status}</div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const fetchOrders = async () => {
    if (!user?.id) throw new Error("User not found");
    const productResponse = await axios.post(`/api/orders`, { id: user?.id });
    const productData = productResponse.data as ResponseType<
      (Order & {
        address: Address;
        items: (OrderItemType & { product: Product })[];
        ShipMent: ShipMent[];
      })[]
    >;
    return productData.data;
  };

  const {
    data: orders,
    isLoading: isLoadingOrders,
    isRefetching: isRefetchingOrders,
  } = useQuery(["orders"], fetchOrders, {
    onError(err) {
      toast.error((err as Error).message || "An error occurred");
    },
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
  });
  return (
    <div className="flex flex-col gap-4">
      {orders?.map((order, ind) => (
        <OrderItem order={order} ind={ind} />
      ))}
    </div>
  );
};

export default Orders;
