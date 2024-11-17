"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { BarLoader, ScaleLoader } from "react-spinners";
import { useAuth } from "@/provider/auth-provider/auth-provider";
import { toast } from "react-toastify";
import { Address, Product, User, Wallet } from "@prisma/client";
import { errorType, ResponseType } from "@/types/common-types";
import { useRouter } from "next/navigation";

type InitialValuesType = {
  phone: string;
  password: string;
};

type UserResponseType = User & {
  addresses: Address[];
  // orders: Order & { items: OrderItem[] };
  // Cart: Cart & { items: OrderItem[]; sharedUsers: User[] };
  // SharedCart: Cart & { items: OrderItem[]; sharedUsers: User[] };
  // Wishlist: Wishlist & { items: WishlistItem[] };
  // SharedWishList: Wishlist & {
  //   items: WishlistItem[];
  //   sharedUsers: User[];
  // };
  Wallet: Wallet[];
  recentlyViewed: Product[];
};

const Signin = () => {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();

  const formik = useFormik<InitialValuesType>({
    initialValues: {
      phone: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validate(values) {
      const errors: Partial<Record<keyof InitialValuesType, string>> = {};
      if (!values.phone) {
        errors.phone = "Phone is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
  });

  const [signInLoading, setSignInLoading] = React.useState(false);
  const signIn = async () => {
    setSignInLoading(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(formik.values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await response.json()) as ResponseType<UserResponseType>;
      if (response.status !== 200) {
        toast.error(data.message || "Some error occurred");
        throw new Error("Some error occurred");
      }
      setUser(data.data);
      setIsAuthenticated(true);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error((error as errorType).message || "Some error occurred");
    } finally {
      setSignInLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Already Signed In");
      router.replace("/");
    }
  }, [isAuthenticated, router]);
  return (
    <div className="wrapper w-full h-[85vh] flex items-center justify-center">
      <div className="w-[clamp(200px,450px,90vw)] m-auto flex flex-col gap-3 items-center justify-center rounded-xl bg-gray-200 p-4">
        <h1 className="text-xl font-semibold">Gift A Green - SignIn</h1>
        <div className="desc mb-4 text-center text-sm text-gray-400 font-medium">
          just enter your phone & password and you are in
        </div>
        <div className="w-[95%] md:w-[80%] flex flex-col gap-3 items-center justify-center">
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            className="w-full px-3 py-1.5 rounded-md"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-3 py-1.5 rounded-md"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <div className="flex justify-end items-center w-full">
            <Button onClick={signIn} className="bg-gray-700 relative">
              {signInLoading && (
                <div className="loader w-full h-full absolute bg-white/70">
                  <BarLoader color="white" />
                </div>
              )}
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
