import prisma from "../../../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { Cart, CartItem, Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const data = await prisma.cart.findUnique({
      where: {
        id: id,
      },
      include: {
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
        message: "Successfully fetched cart items",
        status: "success",
      } as ResponseType<
        Cart & {
          sharedUsers: {
            id: string;
            email: string | null;
            name: string | null;
          }[];
          items: (CartItem & { product: Product })[];
        }
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

const PostBodySchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);
    const data = await prisma.cart.update({
      where: {
        id,
      },
      data: {
        items: {
          create: {
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
        message: "Successfully fetched cart items",
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
const PutBodySchema = z.object({
  cartItemId: z.string(),
  quantity: z.number(),
});

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const body = await request.json();
    const parsedBody = PutBodySchema.parse(body);
    const data = await prisma.cart.update({
      where: {
        id,
      },
      data: {
        items: {
          update: {
            where: {
              id: parsedBody.cartItemId,
            },
            data: {
              quantity: parsedBody.quantity,
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
    const data = await prisma.cart.update({
      where: {
        id,
      },
      data: {
        items: {
          delete: {
            id: parsedBody.cartItemId,
          },
        },
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully deleted cart item",
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
