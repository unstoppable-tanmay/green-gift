import prisma from "../../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { Cart } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  try {
    const data = await prisma.wishlist.findUnique({
      where: {
        id,
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
        message: "Successfully fetched wishlist items",
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

const PostBodySchema = z.object({
  productId: z.string(),
});

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ cart: string }> }
) => {
  const { cart } = await params;
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);
    const data = await prisma.wishlist.update({
      where: {
        id: cart,
      },
      data: {
        items: {
          create: {
            product: {
              connect: {
                id: parsedBody.productId,
              },
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
const PutBodySchema = z.object({
  wishlistItemId: z.string(),
  userPhone: z.string(),
});

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  try {
    const body = await request.json();
    const parsedBody = PutBodySchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { phone: parsedBody.userPhone },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          data: null,
          status: "error",
        } as ResponseType<any>,
        { status: 400 }
      );
    }
    const data = await prisma.wishlist.update({
      where: {
        id,
      },
      data: {
        admin: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully added shared user to wishlist",
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
  { params }: { params: Promise<{ cart: string }> }
) => {
  const { cart } = await params;
  try {
    const body = await request.json();
    const parsedBody = DeleteBodySchema.parse(body);
    const data = await prisma.cart.update({
      where: {
        id: cart,
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
