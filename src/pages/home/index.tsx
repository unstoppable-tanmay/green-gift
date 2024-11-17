"use client";

import {} from "@/actions/auth";
import BannerCard from "@/components/common/cards/banner-card";
import ItemCardGreen from "@/components/common/cards/item-card-green";
import ItemCardNew from "@/components/common/cards/item-card-new";
import React from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { ResponseType } from "@/types/common-types";
import { MarketingCampaign, Product } from "@prisma/client";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Home = () => {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  const fetchProducts = async () => {
    const allProductsResponse = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ name: undefined, page: 1, size: 10 }),
    });
    const allProducts = (await allProductsResponse.json()) as ResponseType<{
      products: Product[];
      totalCount: number;
    }>;
    return allProducts.data;
  };
  const fetchNewArrivals = async () => {
    const newArrivalsResponse = await fetch("/api/products/new");
    const newArrivals = (await newArrivalsResponse.json()) as ResponseType<
      Product[]
    >;
    return newArrivals.data;
  };
  const fetchMarketingCampaigns = async () => {
    const marketingCampaignsResponse = await fetch("/api/campaigns");
    const marketingCampaigns =
      (await marketingCampaignsResponse.json()) as ResponseType<
        MarketingCampaign[]
      >;
    return marketingCampaigns.data;
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

  const {
    data: newArrivals,
    isLoading: isLoadingNewArrivals,
    isRefetching: isRefetchingNewArrivals,
  } = useQuery("newArrivals", fetchNewArrivals, {
    onError(err) {
      toast.error((err as Error).message || "An error occurred");
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: marketingCampaigns,
    isLoading: isLoadingMarketingCampaigns,
    isRefetching: isRefetchingMarketingCampaigns,
  } = useQuery("marketingCampaigns", fetchMarketingCampaigns, {
    onError(err) {
      toast.error((err as Error).message || "An error occurred");
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex column gap-3 flex-col">
      {/* Banner */}
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        className="w-[100%] h-[50vh]"
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay]}
      >
        {marketingCampaigns?.map((campaign) => (
          <SwiperSlide key={campaign.id} className="p-3 md:p-7 pt-1 md:pt-2">
            <BannerCard marketingCampaign={campaign} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* New Arrivals */}
      <h2 className="font-poppins font-semibold text-2xl px-3 md:px-7">
        New Arrivals
      </h2>
      <Swiper
        className="w-full px-0 md:px-7"
        loop
        freeMode
        breakpoints={{
          250: {
            slidesPerView: 2,
            spaceBetween: 10,
            slidesOffsetBefore: 10,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 15,
            slidesOffsetBefore: 15,
          },
          800: {
            slidesPerView: 3,
            spaceBetween: 20,
            slidesOffsetBefore: 20,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 25,
            slidesOffsetBefore: 25,
          },
          1600: {
            slidesPerView: 5,
            spaceBetween: 30,
            slidesOffsetBefore: 30,
          },
          2000: {
            slidesPerView: 6,
            spaceBetween: 35,
            slidesOffsetBefore: 35,
          },
          2400: {
            slidesPerView: 7,
            spaceBetween: 40,
            slidesOffsetBefore: 40,
          },
          2800: {
            slidesPerView: 8,
            spaceBetween: 45,
            slidesOffsetBefore: 45,
          },
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        centeredSlides
        centeredSlidesBounds
        centerInsufficientSlides
        modules={[Autoplay]}
      >
        {newArrivals?.map((product) => (
          <SwiperSlide key={product.id}>
            <ItemCardGreen product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

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
    </div>
  );
};

export default Home;
