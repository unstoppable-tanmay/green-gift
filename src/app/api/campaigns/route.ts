import prisma from "../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { MarketingCampaign, Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const data = await prisma.marketingCampaign.findMany({});

    return NextResponse.json(
      {
        data,
        message: "Successfully fetched marketing Campaigns",
        status: "success",
      } as ResponseType<MarketingCampaign[]>,
      { status: 200 }
    );
  } catch (error) {
    // console.error(error);
    return NextResponse.json(
      {
        message: (error as ResponseType<unknown>).message || error,
        data: null,
        status: "error",
      } as ResponseType<unknown>,
      { status: 400 }
    );
  }
};
