"use client";

import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";

import { FaHeart, FaStar } from "react-icons/fa6";
import { useAuth } from "@/provider/auth-provider/auth-provider";
import { toast } from "react-toastify";
import { BarLoader } from "react-spinners";

const ItemCard = ({ product }: { product: Product }) => {
  const router = useRouter();

  const { user, isAuthenticated } = useAuth();

  const [addToCartLoading, setAddToCartLoading] = React.useState(false);
  const addToCart = () => {
    if (!isAuthenticated) return;
    setAddToCartLoading(true);
    axios
      .post("/api/cart/add", {
        userId: user?.id,
        productId: product.id,
        quantity: 1,
      })
      .then((res) => {
        toast.success(res.data.message || "Successfully added to cart");
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Failed to add to cart");
      })
      .finally(() => {
        setAddToCartLoading(false);
      });
  };
  return (
    <div className="w-[clamp(150px,175px,300px)] sm:w-[clamp(150px,200px,300px)] md:w-[clamp(150px,260px,300px)] aspect-[1/1.38] max-sm:m-0.5 m-2 flex flex-col">
      <div className="top flex h-[11%]">
        <div
          className="left rounded-t-2xl h-full w-[65%] bg-[#C4D3CF] relative after:content-[' '] 
        after:shadow-[0_15px_0_0] after:shadow-[#C4D3CF] after:h-full after:w-[15%] after:bg-transparent after:absolute 
        after:top-0 after:right-0 after:translate-x-[100%] after:rounded-bl-2xl after:-z-10 flex items-center "
        >
          <div className="text-sm max-sm:text-xs font-medium line-clamp-1 text-ellipsis px-3 py-1 text-[#024F3F]">
            {"Outdoor Plants"}
          </div>
        </div>
        <div className="right rounded-xl flex-1 m-1 mt-0 flex gap-1">
          <div className="but1 rounded-full h-full flex-1 hover:flex-[1.2] duration-200 bg-gray-100 flex items-center justify-center">
            <FaHeart className="max-sm:w-3 max-sm:h-3 w-5 h-5 text-gray-500" />
          </div>
          <div className="but1 rounded-full h-full flex-1 hover:flex-[1.2] duration-200 bg-gray-100 flex gap-1 items-center justify-center max-sm:text-[8px] text-xs">
            {product.stars}
            <FaStar className="text-yellow-400" />
          </div>
        </div>
      </div>
      <div
        className="middle rounded-tr-2xl rounded-bl-2xl bg-[#C4D3CF] h-[76%] cursor-pointer"
        onClick={() => {
          router.push(`/${product.id}`);
        }}
      >
        <div className="image p-2 rounded-2xl overflow-hidden w-full h-full flex flex-col gap-1">
          <img
            src={product.images[0]}
            className="object-cover bg-blend-multiply bg-white rounded-2xl overflow-hidden h-full w-full"
            alt=""
          />
          <div className="flex gap-2 items-center px-1 py-1">
            <div className="font-semibold max-sm:text-sm line-clamp-1 text-ellipsis text-white w-[70%]">
              {product.name}
            </div>
            <div className="font-bold max-sm:text-base text-lg text-[#024F3F] w-[30%] text-right">
              ₹{product.price}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom flex h-[13%]">
        <div
          className="left max-sm:text-[10px] max-md:text-sm rounded-xl flex-1 m-1 bg-gray-100 hover:bg-gray-200 duration-200 hover:font-semibold font-medium cursor-pointer peer flex items-center justify-center relative"
          onClick={addToCart}
        >
          {addToCartLoading && (
            <div className="loader absolute bg-white/80 w-full h-full flex items-center justify-center">
              <BarLoader />
            </div>
          )}
          Add To Cart
        </div>
        <div
          className="right rounded-b-2xl h-full w-[50%] peer-hover:w-[47%] hover:w-[53%] duration-200 bg-[#C4D3CF]  relative after:content-[' '] 
        after:shadow-[0_-15px_0_0] after:shadow-[#C4D3CF] after:h-full after:w-[15%] after:bg-transparent after:absolute 
        after:top-0 after:left-0 after:translate-x-[-100%] after:rounded-tr-2xl after:-z-10"
        >
          <div className="p-1 w-full h-full">
            <div
              onClick={() => {
                router.push(`/orders/new/${product?.id}`);
              }}
              className="button max-sm:text-[10px] max-md:text-sm bg-white flex items-center justify-center rounded-xl font-medium hover:font-semibold w-full h-full cursor-pointer"
            >
              Buy Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
