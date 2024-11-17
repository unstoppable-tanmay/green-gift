import prisma from "../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const PostBodySchema = z.object({
  name: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
  category: z.string().optional(),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);

    const [data, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          name: {
            contains: parsedBody.name,
          },
          Category: {
            id: parsedBody.category,
          },
        },
        include: {
          Category: true,
        },
        skip: (parsedBody.page ?? 1 - 1) * (parsedBody.size ?? 0),
        take: parsedBody.size ?? 10,
      }),
      prisma.product.count({
        where: {
          name: {
            contains: parsedBody.name,
          },
          Category: {
            id: parsedBody.category,
          },
        },
      }),
    ]);
    return NextResponse.json(
      {
        data: {
          products: data,
          totalCount,
        },
        message: "Successfully fetched products",
        status: "success",
      } as ResponseType<{ products: Product[]; totalCount: number }>,
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
