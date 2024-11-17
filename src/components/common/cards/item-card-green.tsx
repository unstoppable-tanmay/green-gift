import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

const ItemCardGreen = ({ product }: { product: Product }) => {
  const router = useRouter();
  return (
    <div
      className="w-[clamp(150px,180px,300px)] md:w-[clamp(100px,260px,280px)] aspect-[1/1.42] max-sm:m-0.5 m-2 flex flex-col rounded-2xl bg-gray-300 relative overflow-hidden justify-end cursor-pointer"
      onClick={() => {
        router.push(`/${product.id}`);
      }}
    >
      <div className="image absolute top-0 left-0 w-full h-full">
        <img
          src={product.images[0]}
          alt=""
          className="object-cover bg-blend-multiply bg-gray-100 rounded-t-2xl overflow-hidden h-full w-full"
        />
      </div>
      <div
        onClick={() => {
          router.push(`/orders/new/${product?.id}`);
        }}
        className="view px-4 max-md:text-sm max-md:py-1 py-2 max-md:rounded-lg rounded-xl bg-[#024F3F60] text-white font-medium hover:bg-[#024F3F80] duration-200 hover:-translate-y-1 flex z-[10] items-center justify-center m-1.5"
      >
        Buy Now
      </div>
    </div>
  );
};

export default ItemCardGreen;
