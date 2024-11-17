import prisma from "../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import {
  Address,
  Cart,
  Order,
  OrderItem,
  Product,
  ShipMent,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";
import { z } from "zod";

const PostBodySchema = z.object({
  id: z.string(),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);
    const data = await prisma.order.findMany({
      where: {
        userId: parsedBody.id,
      },
      include: {
        ShipMent: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully fetched Order items",
        status: "success",
      } as ResponseType<
        (Order & {
          address: Address;
          items: (OrderItem & { product: Product })[];
          ShipMent: ShipMent[];
        })[]
      >,
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
