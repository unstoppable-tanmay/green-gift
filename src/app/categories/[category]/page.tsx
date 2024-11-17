"use client";

import ItemCardNew from "@/components/common/cards/item-card-new";
import { ResponseType } from "@/types/common-types";
import { Product } from "@prisma/client";
import React, { use } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const CategoryProducts = ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = use(params);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  const fetchProducts = async () => {
    const allProductsResponse = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ name: undefined, category, page: 1, size: 10 }),
    });
    const allProducts = (await allProductsResponse.json()) as ResponseType<{
      products: Product[];
      totalCount: number;
    }>;
    return allProducts.data;
  };

  const {
    data: products,
    isLoading: isLoadingProducts,
    isRefetching: isRefetchingProducts,
  } = useQuery(["products", page, size], fetchProducts, {
    onError(err) {
      toast.error((err as Error).message || "An error occurred");
    },
    refetchOnWindowFocus: false,
  });
  return (
    <>
      {/* Gift Green */}
      <h2 className="font-poppins font-semibold text-2xl px-2.5 md:px-7 mt-4 md:mt-8">
        Gift Green
      </h2>
      <div className="flex gap-1 md:gap-8 flex-wrap justify-between px-2.5 md:px-7">
        {products?.products.map((product) => (
          <ItemCardNew key={product.id} product={product} />
        ))}
      </div>
      {products && (
        <div className="flex justify-end items-center gap-3 px-2.5 md:px-7 mb-3">
          <div
            className="left w-8 aspect-square cursor-pointer flex items-center justify-center rounded-xl bg-gray-200"
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
          >
            <MdChevronLeft className="w-6 h-6" />
          </div>
          <div className="font-semibold">{`Page ${page} Of ${Math.floor(
            (products?.totalCount ?? 10) / size
          )}`}</div>
          <div
            className="right w-8 aspect-square cursor-pointer flex items-center justify-center rounded-xl bg-gray-200"
            onClick={() => {
              if (page < (products?.totalCount ?? 10) / size) setPage(page + 1);
            }}
          >
            <MdChevronRight className="w-6 h-6" />
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryProducts;
