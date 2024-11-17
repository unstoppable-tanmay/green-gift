import Modal from "@/components/common/modal/modal";
import { errorType, ResponseType } from "@/types/common-types";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useQuery } from "react-query";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";

const CategoryItem = ({
  category,
  setOpen,
}: {
  category: Category;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  return (
    <div
      className="category-item flex flex-col gap-2 items-center justify-center cursor-pointer"
      onClick={() => {
        setOpen(false);
        router.push(`/categories/${category.id}`);
      }}
    >
      <img
        src={category.image}
        alt=""
        className="w-[100px] aspect-square rounded-full object-cover"
      />
      <h1 className="title font-medium text-center">{category.name}</h1>
    </div>
  );
};

const Categories = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = (await res.json()) as ResponseType<Category[]>;
    return data.data;
  };

  const {
    data: categories,
    isLoading,
    isRefetching,
  } = useQuery<Category[]>("categories", fetchCategories, {
    onError(err) {
      toast.error((err as errorType).message || "An error occurred");
    },
    enabled: open,
    refetchOnWindowFocus: false,
  });
  return (
    <Modal open={open} setOpen={setOpen} title="Categories">
      <div className="w-[500px] flex gap-5 flex-wrap p-5 items-center justify-center">
        {isLoading || isRefetching ? (
          <div className="w-full h-[100px] flex justify-center items-center">
            <BarLoader />
          </div>
        ) : (
          categories?.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              setOpen={setOpen}
            />
          ))
        )}
      </div>
    </Modal>
  );
};

export default Categories;
