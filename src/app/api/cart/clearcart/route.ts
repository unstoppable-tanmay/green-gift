import prisma from "../../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { Cart } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PostBodySchema = z.object({
  cartId: z.string(),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);
    const data = await prisma.cart.update({
      where: {
        id: parsedBody.cartId,
      },
      data: {
        items: {
          deleteMany: {},
        },
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully cleared cart",
        status: "success",
      } as ResponseType<Cart>,
      { status: 200 }
    );
  } catch (error) {
    // console.error(error);
    return NextResponse.json(
      {
        message: (error as ResponseType<any>).message || error,
        data: null,
        status: "error",
      } as ResponseType<any>,
      { status: 400 }
    );
  }
};
