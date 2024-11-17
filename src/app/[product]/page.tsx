"use client";
import { use } from "react";
import Loader, { LoaderWithPortal } from "@/components/common/loader/loader";
import Switch from "@/components/common/switch/switch";
import { useAuth } from "@/provider/auth-provider/auth-provider";
import { ResponseType } from "@/types/common-types";
import {
  Category,
  Product as ProductType,
  Review,
  Tips as TipsType,
} from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import ReactStars from "react-stars";
import { toast } from "react-toastify";

const ProductPage = ({ params }: { params: Promise<{ product: string }> }) => {
  const { product: id } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [quantity, setQuantity] = React.useState(1);
  const [image, setImage] = React.useState<string | undefined>(undefined);
  const fetchProduct = async () => {
    const productResponse = await fetch(`/api/products/${id}`);
    const productData = (await productResponse.json()) as ResponseType<
      ProductType & { Review: Review[]; Tips: TipsType[]; Category: Category }
    >;
    return productData.data;
  };

  const {
    data: product,
    isLoading: isLoadingProduct,
    isRefetching: isRefetchingProduct,
  } = useQuery(["product" + id], fetchProduct, {
    onError(err) {
      toast.error((err as Error).message || "An error occurred");
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (product) setImage(product?.images[0]);
  }, [product]);

  const [addToCartLoading, setAddToCartLoading] = React.useState(false);
  const addToCart = () => {
    if (!isAuthenticated) return;
    setAddToCartLoading(true);
    axios
      .post("/api/cart/add", {
        userId: user?.id,
        productId: product?.id,
        quantity,
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
    <div className="flex flex-col gap-5 relative">
      <LoaderWithPortal
        isLoading={isLoadingProduct || isRefetchingProduct}
        transparency="0.6"
        fullScreen
      />
      <div className="product flex max-md:flex-col gap-5 w-full justify-center max-md:items-center">
        <div className="image relative">
          <div className="image w-[90vw] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] aspect-square bg-gray-200 rounded-2xl sticky top-0 left-0 overflow-hidden">
            <img src={image} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="thumbnails flex gap-2 mt-2 overflow-x-auto">
            {product?.images.map((img, ind) => (
              <div
                key={ind}
                className="thumbnail w-14 h-14 flex-shrink-0 aspect-square bg-gray-200 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setImage(img)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="details flex flex-col max-md:w-full px-7 py-3 gap-7 w-[clamp(200px,500px,90vw)]">
          <div className="flex flex-col">
            {/* Name */}
            <div className="name font-poppins text-xl font-semibold">
              {product?.name}
            </div>

            {/* Star */}
            <ReactStars
              count={5}
              value={product?.stars}
              edit={false}
              size={24}
              className=""
            />
          </div>

          {/* Price */}
          <div className="price font-poppins flex gap-2 items-center">
            <div className="prevPrice flex items-end h-full">
              <div className="text-sm line-through">
                ₹{product?.price ? product?.price + product?.price * 0.2 : ""}
              </div>
            </div>
            <div className="text-2xl font-medium text-[#149253]">
              ₹{product?.price}
            </div>
            <div className="tag font-poppins text-xs px-2.5 py-0.5 rounded-full bg-yellow-400 text-white">
              Sale
            </div>
          </div>

          {/* Variants */}
          <div className="variants flex flex-col gap-3">
            <div className="size flex flex-col gap-1">
              <div className="heading font-poppins tracking-wider font-medium uppercase text-gray-600">
                Select Plant Size
              </div>
              <Switch
                tabs={[
                  { id: "small", title: "Small" },
                  { id: "medium", title: "Medium" },
                  { id: "large", title: "Large" },
                ]}
                tab="small"
                setTab={() => {}}
              />
            </div>
            <div className="size flex flex-col gap-1">
              <div className="heading font-poppins tracking-wider font-medium uppercase text-gray-600">
                Select Planter
              </div>
              <Switch
                tabs={[
                  { id: "gropot", title: "GroPot" },
                  { id: "roma", title: "Roma" },
                  { id: "lagos", title: "Lagos" },
                  { id: "krish", title: "Krish" },
                  { id: "jar", title: "Jar" },
                  { id: "atlantis", title: "Atlantis" },
                  { id: "spiro", title: "Spiro" },
                  { id: "diamond", title: "Diamond" },
                ]}
                tab="diamond"
                setTab={() => {}}
              />
            </div>
            <div className="size flex flex-col gap-1">
              <div className="heading font-poppins tracking-wider font-medium uppercase text-gray-600">
                Select Color
              </div>
              <Switch
                tabs={[
                  { id: "gold", title: "#FFD700" },
                  { id: "silver", title: "#C0C0C0" },
                  { id: "platinum", title: "#E5E4E2" },
                  { id: "emerald", title: "#50C878" },
                  { id: "sapphire", title: "#0F52BA" },
                  { id: "ruby", title: "#E0115F" },
                  { id: "onyx", title: "#353839" },
                  { id: "pearl", title: "#FDEEF4" },
                ]}
                tab="sapphire"
                setTab={() => {}}
                color
              />
            </div>
          </div>

          {/* Button */}
          <div className="buttons flex flex-wrap gap-3 mt-2 items-center">
            <div className="quantity flex gap-3 font-poppins font-medium text-lg">
              <div
                className="dec w-7 cursor-pointer flex items-center justify-center aspect-square rounded-full bg-gray-300"
                onClick={() => {
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
              >
                -
              </div>
              {quantity}
              <div
                className="inc w-7 cursor-pointer flex items-center justify-center aspect-square rounded-full bg-gray-300"
                onClick={() => {
                  if (quantity < 8) setQuantity(quantity + 1);
                }}
              >
                +
              </div>
            </div>
            <button
              onClick={addToCart}
              disabled={addToCartLoading}
              className="appearance-none font-medium text-xs md:text-sm whitespace-nowrap max-w-[170px] lg:text-base flex-1 py-1 px-3 rounded-full border-2 border-[#149253] hover:bg-[#149253] uppercase tracking-wider duration-150 text-[#149253] hover:text-white"
            >
              {addToCartLoading ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => {
                router.push(`/orders/new/${product?.id}`);
              }}
              className="flex-1 font-medium text-xs md:text-sm whitespace-nowrap max-w-[170px] lg:text-base py-1 px-3 rounded-full appearance-none border-2 border-[#149253] bg-[#149253] uppercase tracking-wider text-white duration-200 hover:scale-[1.005] active:scale-100"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {/* About */}
      <div className="about flex flex-col w-[clamp(200px,900px,90vw)] mx-auto text-center justify-center items-center mt-3">
        <div className="heading font-poppins font-semibold text-3xl">About</div>
        <div className="content">{product?.about}</div>
      </div>

      {/* Tips */}
      <div className="tips flex flex-col w-[clamp(200px,900px,90vw)] mx-auto mt-3 mb-5 bg-gray-50 p-2 rounded-md gap-2">
        {product?.Tips.map((tip, ind) => (
          <React.Fragment key={ind}>
            <Tips tips={tip} />
            {ind !== product?.Tips.length - 1 && (
              <div className="divider flex mx-[10%] h-[1.7px] bg-gray-200 rounded-full"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;

const Tips = ({ tips }: { tips: TipsType }) => {
  return (
    <div className="tip flex gap-2">
      <div className="icon w-7 h-7 aspect-square bg-gray-200 rounded-full">
        {tips.image && (
          <img
            src={tips.image ?? undefined}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="content flex flex-col gap-1">
        <div className="heading font-semibold">{tips.title}</div>
        <div className="content text-sm">{tips.content}</div>
      </div>
    </div>
  );
};
