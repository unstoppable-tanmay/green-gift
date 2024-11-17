"use client";

import Loader from "@/components/common/loader/loader";
import { errorType, ResponseType } from "@/types/common-types";
import { Address, Product, User, Wallet } from "@prisma/client";
import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

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

interface AuthContextType {
  user: UserResponseType | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserResponseType | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserResponseType | null>(null);

  const fetchUser = async (): Promise<UserResponseType | null> => {
    try {
      const response = await fetch("/api/auth/authenticate");
      if (response.status !== 200) {
        // toast.info("Please sign in to continue");
        throw new Error("Unauthorized");
      }
      const data = (await response.json()) as ResponseType<UserResponseType>;
      console.log(data);
      return data.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // toast.error("An error occurred Please sign in again");
      return null;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "user",
    queryFn: fetchUser,
    onSuccess(data) {
      if (data) {
        console.log("authenticated");
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    },
    onError(err) {
      setIsAuthenticated(false);
      toast.error(
        (err as errorType).message || "An error occurred Please sign in again"
      );
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (data) setUser(data!);
    console.log(data);
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isError,
        isAuthenticated,
        setIsAuthenticated,
        setUser,
      }}
    >
      <Loader isLoading={isLoading} fullScreen />
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
