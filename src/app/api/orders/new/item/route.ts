import { ResponseType } from "@/types/common-types";
import { Cart } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../../../prisma/prisma";
import { Order } from ".prisma/client";

const PostBodySchema = z.object({
  itemId: z.string(),
  userId: z.string(),
  addressId: z.string(),
  paymentMethod: z.enum(["COD", "POC"]),
  quantity: z.number(),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);

    const product = await prisma.product.findFirst({
      where: {
        id: parsedBody.itemId,
      },
    });

    if (!product)
      return NextResponse.json(
        {
          message: "Product not found",
          data: null,
          status: "error",
        } as ResponseType<any>,
        { status: 400 }
      );

    const data = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: parsedBody.userId,
          },
        },
        items: {
          create: {
            quantity: parsedBody.quantity,
            price: product.price,
            productId: product.id,
          },
        },
        address: {
          connect: {
            id: parsedBody.addressId,
          },
        },
        status: "PENDING",
        totalAmount: product.price * parsedBody.quantity,
        ShipMent: {
          create: {
            status: "PENDING",
          },
        },
      },
    });

    if (parsedBody.paymentMethod === "POC") {
      await prisma.wallet.update({
        where: {
          id: parsedBody.userId,
        },
        data: {
          balance: {
            decrement: data.totalAmount,
          },
        },
      });
    }

    return NextResponse.json(
      {
        data,
        message: "Successfully Ordered Item",
        status: "success",
      } as ResponseType<Order>,
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
