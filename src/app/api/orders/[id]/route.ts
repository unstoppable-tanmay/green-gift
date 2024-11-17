import prisma from "../../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { Cart, Order } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";
import { z } from "zod";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const data = await prisma.order.findUnique({
      where: {
        id,
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

const PostBodySchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);
    const data = await prisma.order.update({
      where: {
        id,
      },
      data: {
        items: {
          create: {
            price: parsedBody.price,
            product: {
              connect: {
                id: parsedBody.productId,
              },
            },
            quantity: parsedBody.quantity,
          },
        },
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully added order",
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
const PutBodySchema = z.object({
  address: z.string(),
  userId: z.string(),
});

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const body = await request.json();
    const parsedBody = PutBodySchema.parse(body);
    const data = await prisma.order.update({
      where: {
        id,
      },
      data: {
        address: {
          upsert: {
            create: {
              user: {
                connect: {
                  id: parsedBody.userId,
                },
              },
              address: parsedBody.address,
            },
            update: {
              address: parsedBody.address,
            },
          },
        },
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully fetched cart items",
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

const DeleteBodySchema = z.object({
  cartItemId: z.string(),
});

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const body = await request.json();
    const parsedBody = DeleteBodySchema.parse(body);
    const data = await prisma.order.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully deleted order",
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
