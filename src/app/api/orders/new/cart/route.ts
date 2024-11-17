import { ResponseType } from "@/types/common-types";
import { Cart } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../../../prisma/prisma";
import { Order } from ".prisma/client";

const PostBodySchema = z.object({
  cartId: z.string(),
  userId: z.string(),
  addressId: z.string(),
  paymentMethod: z.enum(["COD", "POC"]),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);

    const cart = await prisma.cart.findFirst({
      where: {
        id: parsedBody.cartId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart)
      return NextResponse.json(
        {
          message: "Cart not found",
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
          createMany: {
            data: cart.items.map((item) => ({
              quantity: item.quantity,
              price: item.product.price,
              productId: item.product.id,
            })),
          },
        },
        address: {
          connect: {
            id: parsedBody.addressId,
          },
        },
        status: "PENDING",
        totalAmount: cart.items.reduce(
          (p, c) => p + c.product.price * c.quantity,
          0
        ),
        ShipMent: {
          create: {
            status: "PENDING",
          },
        },
      },
    });

    await prisma.cart.update({
      where: {
        id: parsedBody.cartId,
      },
      data: {
        items: {
          deleteMany: {},
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
        message: "Successfully checkout all cart items",
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
