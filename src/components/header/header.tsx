"use client";

import { useAuth } from "@/provider/auth-provider/auth-provider";
import { getInitials } from "@/utils/format";
/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  CiCircleList,
  CiCircleRemove,
  CiGift,
  CiHeart,
  CiLogin,
  CiLogout,
  CiMemoPad,
  CiPenpot,
  CiShoppingCart,
  CiUser,
  CiWallet,
} from "react-icons/ci";
import { toast } from "react-toastify";
import Categories from "../modals/categories-modal";
import Cart from "../cart";
import Modal from "../common/modal/modal";
import { RiMenu5Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

const Header = () => {
  const [drawer, setDrawer] = useState(false);
  const [cart, setCart] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const router = useRouter();

  const [categoriesModal, setCategoriesModal] = useState(false);

  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();

  const drawerRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideOfDrawer = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawer(false);
      }
    };

    document.addEventListener("click", handleClickOutsideOfDrawer);
    return () => {
      document.removeEventListener("click", handleClickOutsideOfDrawer);
    };
  }, []);

  const signOut = async () => {
    try {
      const response = await fetch("/api/auth/signout");
      if (!response.ok) {
        toast.error("An error occurred while signing out");
      }
      setUser(null);
      setIsAuthenticated(false);
      setDrawer(false);
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wrapper sticky top-0 left-0 bg-white z-[920]">
      <Categories
        open={categoriesModal}
        setOpen={(val) => setCategoriesModal(val)}
      />
      <div className="flex justify-between items-center p-4 pt-2 pr-0 font-poppins relative">
        <div className="max-sm:hidden text-lg font-semibold">
          {user?.name ? "Hi " + user?.name.split(" ")[0] + "!" : "Hi there!"}
        </div>
        <img
          src="https://www.giftagreen.com/cdn/shop/files/gift-a-green-logo-transparent_1000x1000.png?v=1634653122"
          alt=""
          className="w-28 object-cover"
        />
        <div></div>

        {/* side drawer */}
        <div
          className={clsx(
            "drawer absolute top-0 right-0 w-[clamp(100px,300px,75vw)] h-screen duration-300 z-[901] shadow-md",
            drawer ? "translate-x-0" : "translate-x-[100%]"
          )}
          ref={drawerRef}
        >
          <div className="container relative w-full h-full bg-white">
            <div
              className={clsx(
                "pr-3 bg-gray-200 rounded-l-full p-1 duration-150 absolute left-0 top-2 z-[-10]",
                !drawer && "hover:translate-x-[-100%]",
                cart ? "translate-x-[0%]" : "translate-x-[-95%]"
              )}
              onClick={() => setDrawer((prev) => !prev)}
            >
              <div className="user w-8 aspect-square rounded-full border-2 border-gray-700 shadow-sm flex items-center justify-center pointer-events-none">
                {isAuthenticated ? (
                  getInitials(user?.name ?? "")
                ) : drawer ? (
                  <IoClose className="w-5 h-5 text-red-500" />
                ) : (
                  <RiMenu5Line className="w-5 h-5" />
                )}
              </div>
            </div>

            <div className="flex flex-col h-full p-4 gap-4 pt-16 text-gray-500">
              {!isAuthenticated && (
                <div
                  onClick={() => {
                    if (!isAuthenticated) {
                      setDrawer(false);
                      router.push("/signin");
                      return;
                    }
                  }}
                  className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center text-green-700 hover:text-green-800"
                >
                  <CiLogin className="w-5 h-5" />
                  Sign In
                </div>
              )}
              <div
                onClick={() => {
                  setDrawer(false);
                  setCategoriesModal(true);
                }}
                className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800"
              >
                <CiCircleList className="w-5 h-5" />
                Categories
              </div>
              <div className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800">
                <CiPenpot className="w-5 h-5" />
                All Products
              </div>

              {isAuthenticated && (
                <>
                  <div
                    className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800"
                    onClick={() => {
                      setDrawer(false);
                      setCart(true);
                    }}
                  >
                    <CiShoppingCart className="w-5 h-5" />
                    Cart
                  </div>
                  <div
                    onClick={() => {
                      setDrawer(false);
                      setWalletModal(true);
                    }}
                    className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800"
                  >
                    <CiWallet className="w-5 h-5" />
                    Wallet
                  </div>
                  <div
                    className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800"
                    onClick={() => {
                      if (isAuthenticated) {
                        setDrawer(false);
                        router.push("/orders");
                        return;
                      }
                    }}
                  >
                    <CiGift className="w-5 h-5" />
                    Orders
                  </div>
                  <div className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800">
                    <CiMemoPad className="w-5 h-5" />
                    Addresses
                  </div>
                  <div className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800">
                    <CiHeart className="w-5 h-5" />
                    Wishlist
                  </div>
                  <div className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center hover:text-gray-800">
                    <CiUser className="w-5 h-5" />
                    You
                  </div>
                  <div className="flex-1"></div>
                  <div
                    onClick={signOut}
                    className="text-lg font-poppins font-medium hover:translate-x-1 duration-200 cursor-pointer gap-2 flex items-center text-orange-600 hover:text-orange-700 mb-6"
                  >
                    <CiLogout className="w-5 h-5" />
                    Sign Out
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* cart */}
        {isAuthenticated && (
          <div
            className={clsx(
              "cart absolute top-0 left-[50%] translate-x-[-50%] w-[95vw] md:w-[80vw] lg:w-[75vw] h-[75vh] duration-300 z-[901]",
              cart ? "translate-y-0" : "translate-y-[-100%]"
            )}
            ref={cartRef}
          >
            <div className="container relative w-full h-full bg-white rounded-b-2xl shadow-md flex">
              <div
                className={clsx(
                  "pt-2 rounded-b-full p-1 duration-150 absolute max-sm:right-16 right-7 bottom-0 z-[-10]",
                  !cart
                    ? "hover:translate-y-[100%] bg-gray-200"
                    : "bg-gray-400",
                  drawer ? "translate-y-[0%]" : "translate-y-[95%]"
                )}
                onClick={() => setCart((prev) => !prev)}
              >
                <div
                  className={clsx(
                    "user w-8 aspect-square p-1 rounded-full flex items-center justify-center bg-white"
                  )}
                >
                  {!cart ? (
                    <CiShoppingCart className="w-5 h-5" />
                  ) : (
                    <IoClose className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>

              <Cart isOpen={cart} setCart={setCart} />
            </div>
          </div>
        )}

        {/* wallet */}
        <Modal
          open={walletModal}
          setOpen={(val) => setWalletModal(val)}
          title="Wallet"
        >
          <div className="w-[clamp(200px,600px,90vw)] h-[130px] ">
            <div className="state p-3 text-lg">
              Total Balance in your wallet is{" "}
              {user?.Wallet && user.Wallet[0].balance} rupees.
            </div>
            <div className="flex justify-end">
              <button className="appearance-none px-2 py-1 rounded-lg bg-gray-300 hover:bg-gray-400">
                Add Balance
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Header;
