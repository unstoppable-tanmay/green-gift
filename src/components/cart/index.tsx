"use client";

import { useAuth } from "@/provider/auth-provider/auth-provider";
import { ResponseType } from "@/types/common-types";
import { Cart as CartType, CartItem, Product } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Loader from "../common/loader/loader";
import Switch from "../common/switch/switch";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/navigation";

type CartResponseType = CartType & {
  sharedUsers: {
    id: string;
    email: string | null;
    name: string | null;
  }[];
  items: (CartItem & { product: Product })[];
};

const Cart = ({
  isOpen,
  setCart,
}: {
  isOpen: boolean;
  setCart: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [cartSelected, setCartSelected] = useState<CartResponseType | null>(
    null
  );
  const [cartTabType, setCartTabType] = useState<"own" | "shared">("own");
  const [sharedCartSelected, setSharedCartSelected] =
    useState<CartResponseType | null>();
  const [sharedCartTabType, setSharedCartTabType] = useState<string>(
    sharedCartSelected?.sharedUsers[0].id!
  );
  const { isAuthenticated, user } = useAuth();
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    const cartResponse = await fetch(`/api/cart/${user?.id}`);
    const cartData = (await cartResponse.json()) as ResponseType<
      CartResponseType[]
    >;
    return cartData.data;
  };

  const {
    data: cart,
    isLoading: isLoadingCart,
    isRefetching: isRefetchingCart,
    refetch: refetchCart,
  } = useQuery(["cart" + user?.id], fetchCart, {
    onError(err) {
      toast.error((err as Error).message || "An error occurred");
    },
    refetchOnWindowFocus: false,
    enabled: isOpen,
  });

  useEffect(() => {
    if (cart) {
      console.log(cart);
      setCartSelected(cart.find((c) => c.adminId === user?.id) ?? cart[0]);
    }
  }, [cart]);
  useEffect(() => {
    console.log(cartSelected);
  }, [cartSelected]);

  const [clearCartLoading, setClearCartLoading] = useState(false);
  const clearCart = async () => {
    setClearCartLoading(true);
    axios
      .post(`/api/cart/clearcart`, {
        cartId: cartSelected?.id,
      })
      .then(async (res) => {
        await refetchCart();
        toast.success(
          (res.data as ResponseType<string>).message || "An error occurred"
        );
      })
      .catch((err) =>
        toast.error((err as Error).message || "An error occurred")
      )
      .finally(() => setClearCartLoading(false));
  };
  return (
    <div className="w-full h-full rounded-b-2xl p-4 flex flex-col gap-3">
      {isLoadingCart ? (
        <div className="wrapper w-full h-full rounded-b-2xl overflow-hidden">
          <Loader isLoading={isLoadingCart} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <Switch
                setTab={(val) => {
                  setCartTabType(val as "own" | "shared");
                  setCartSelected(
                    val === "own"
                      ? cart?.find((c) => c.adminId === user?.id) ?? null
                      : null
                  );
                }}
                tab={cartTabType}
                tabs={[
                  { title: "Your Cart", id: "own" },
                  { title: "Shared Cart", id: "shared" },
                ]}
              />
            </div>
            {cartTabType === "own" && (
              <button className="appearance-none px-3 py-1 flex justify-center items-center rounded-lg bg-gray-300 hover:bg-gray-400 duration-200">
                Share Cart
              </button>
            )}
            {cartTabType === "shared" && (
              <Switch
                setTab={(val) => {
                  setSharedCartTabType(val);
                  setCartSelected(cart?.find((c) => c.id === val) ?? null);
                }}
                tab={sharedCartTabType}
                tabs={
                  cart
                    ? cart
                        .filter((c) => c.adminId !== user?.id)
                        .map((c, i) => ({
                          title:
                            c.sharedUsers[0]?.name ?? "Shared Cart " + (i + 1),
                          id: c.id!,
                        }))
                    : []
                }
              />
            )}
          </div>
          <div className="items flex-1 overflow-y-scroll">
            {cartSelected?.items.map((item) => (
              <div
                className="flex w-full gap-3 p-3 bg-gray-100 rounded-2xl mb-2 items-center"
                key={item.id}
              >
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="h-[70px] md:h-[100px] aspect-square object-cover rounded-xl bg-gray-200"
                />
                <div className="details flex gap-2 justify-between flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="name text-md md:text-xl font-semibold text-gray-700 line-clamp-2">
                      {item.product.name}
                    </div>
                    <div className="desc text-xs md:text-sm text-gray-500 line-clamp-3">
                      {item.product.description}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="price text-xl md:text-2xl font-semibold">
                      ₹{item.product.price}
                    </div>
                    <div className="quantity max-md:text-xs">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="buttons flex justify-between items-center w-full gap-2">
            <div className="total text-xl font-semibold">
              Total: ₹
              {cartSelected?.items.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              )}
            </div>
            <div className="flex gap-2">
              <button
                disabled={!cartSelected}
                className={clsx(
                  "appearance-none px-4 py-2 flex justify-center items-center rounded-md disabled:bg-gray-400 bg-orange-400 hover:bg-orange-500 font-semibold text-white duration-200"
                )}
                onClick={clearCart}
              >
                {clearCartLoading ? "Clearing Cart..." : "Clear Cart"}
              </button>
              <button
                disabled={!cartSelected}
                className={clsx(
                  "appearance-none px-4 py-2 flex justify-center items-center rounded-md disabled:bg-gray-400 bg-emerald-300 hover:bg-emerald-400 font-semibold text-white duration-200"
                )}
                onClick={() => {
                  setCart(false);
                  router.push("/orders/new/cart/" + cartSelected?.id);
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
