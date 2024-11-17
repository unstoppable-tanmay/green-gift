"use client";

import { useAuth } from "@/provider/auth-provider/auth-provider";
import { ResponseType } from "@/types/common-types";
import { Cart, CartItem, Product } from "@prisma/client";
import React, { use, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Select from "react-select";
import Switch from "@/components/common/switch/switch";
import Modal from "@/components/common/modal/modal";
import { useRouter } from "next/navigation";
import axios from "axios";

type CartResponseType = ResponseType<
  Cart & {
    sharedUsers: {
      id: string;
      email: string | null;
      name: string | null;
    }[];
    items: (CartItem & { product: Product })[];
  }
>;

const OrderNew = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = use(params);
  const [tab, setTab] = useState<"single" | "different">("single");

  const [openModal, setOpenModal] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    const cartResponse = await fetch(`/api/cart/get/${id}`);
    const cartData = (await cartResponse.json()) as CartResponseType;
    return cartData.data;
  };

  const [addressOptions, setAddressOptions] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);

  useEffect(() => {
    if (!user) return;
    setAddressOptions(
      user.addresses.map((address) => ({
        label: address.address!,
        value: address.id!,
      }))
    );
  }, [user]);

  const [singleAddress, setSingleAddress] = useState<{
    label: string;
    value: string;
  } | null>({
    value: user?.addresses[0].id!,
    label: user?.addresses[0].address!,
  });

  const {
    data: cart,
    isLoading: isLoadingCart,
    isRefetching: isRefetchingCart,
    refetch: refetchCart,
  } = useQuery(["cart" + id], fetchCart, {
    onError(err) {
      toast.error((err as Error).message || "An error occurred");
    },
    refetchOnWindowFocus: false,
  });

  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const placeOrder = async (type: "COD" | "POC") => {
    setPlaceOrderLoading(true);
    axios
      .post(`/api/orders/new/cart`, {
        cartId: id,
        userId: user?.id,
        addressId: singleAddress?.value,
        paymentMethod: type,
      })
      .then((res) => {
        toast.success(res.data.message || "Order Placed Successfully");
        setOpenModal(false);
        router.replace("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message || "An error occurred");
      })
      .finally(() => {
        setPlaceOrderLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-3 mx-5 md:mx-auto max-w-[800px]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cart Items</h1>
        <Switch
          tab="single"
          setTab={(val) => setTab(val as "single" | "different")}
          tabs={[
            { title: "Single Address", id: "single" },
            { title: "Different Address", id: "different" },
          ]}
        />
      </div>
      <div className="flex flex-col gap-4">
        {isLoadingCart ? (
          <p>Loading...</p>
        ) : (
          cart?.items.map((item) => (
            <React.Fragment key={item.id}>
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-3 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-[100px] aspect-square object-cover rounded-xl"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.product.name}
                    </h2>
                    <p className="text-sm line-clamp-2">
                      {item.product.description}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold">${item.product.price}</p>
                  <p className="text-sm">{item.quantity} Items</p>
                </div>
              </div>
              {tab === "different" && (
                <div className="details">
                  <div className="select">
                    <h1 className="text-lg font-medium">Select Address</h1>
                    <Select
                      placeholder="Select Address"
                      value={singleAddress}
                      onChange={(val) => {
                        setSingleAddress(val);
                      }}
                      options={addressOptions}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
      {tab === "single" && (
        <div className="details">
          <div className="select">
            <h1 className="text-lg font-medium">Select Address</h1>
            <Select
              placeholder="Select Address"
              value={user?.addresses.map((address) => ({
                label: address.address,
                value: address.id,
              }))}
              onChange={(val) => {
                console.log(val);
              }}
              options={addressOptions}
            />
          </div>
        </div>
      )}
      <div className="buttons flex justify-end items-center w-full">
        <button
          onClick={() => setOpenModal(true)}
          className="appearance-none px-5 py-1.5 rounded-md bg-gray-300 hover:bg-gray-400 hover:scale-[1.03] duration-200"
        >
          Place Order
        </button>
      </div>

      <Modal open={openModal} setOpen={setOpenModal} title="Place Order">
        <div className="flex flex-col gap-3 w-[clamp(200px,600px,90vw)]">
          <div className="desc text-gray-600 text-sm">
            Pay by one click from wallet
          </div>
          <div className="details text-xs">
            <div className="flex gap-2 items-center">
              <div className="font-medium">Total Amount</div>
              <div className="">
                ₹
                {cart?.items.reduce(
                  (p, c) => p + c.quantity * c.product.price,
                  0
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="font-medium">Total Items</div>
              <div className="">
                {cart?.items.reduce((p, c) => p + c.quantity, 0)}
              </div>
            </div>
            {tab === "single" && (
              <div className="flex gap-2 items-center">
                <div className="font-medium">Delivery Address</div>
                <div className="">{singleAddress?.label}</div>
              </div>
            )}
          </div>
          <div className="wallet my-2">
            Wallet Amount: {user?.Wallet[0].balance}
          </div>
          <div className="button flex justify-end gap-3 text-sm mt-2">
            <button
              className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 duration-200 rounded-md"
              onClick={() => placeOrder("COD")}
            >
              {placeOrderLoading ? "Placing Order..." : "Pay On Delivery"}
            </button>
            <button
              disabled={
                (cart?.items.reduce(
                  (p, c) => p + c.quantity * c.product.price,
                  0
                ) ?? 0) > (user?.Wallet[0].balance ?? 0)
              }
              onClick={() => {
                placeOrder("POC");
              }}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white duration-200 rounded-md"
            >
              {placeOrderLoading ? "Placing Order..." : "Pay From Wallet"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderNew;
