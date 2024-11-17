import prisma from "../../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;
  console.log(id);
  try {
    const data = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        Tips: true,
        Review: {
          include: { user: { select: { name: true } } },
        },
        Category: true,
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully fetched product",
        status: "success",
      } as ResponseType<Product>,
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
