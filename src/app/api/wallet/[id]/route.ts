import prisma from "../../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { Wallet } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  try {
    const data = await prisma.wallet.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully fetched cart items",
        status: "success",
      } as ResponseType<Wallet>,
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

const PutBodySchema = z.object({
  balance: z.number(),
});

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  try {
    const body = await request.json();
    const parsedBody = PutBodySchema.parse(body);
    const data = await prisma.wallet.update({
      where: {
        id,
      },
      data: {
        balance: parsedBody.balance,
      },
    });
    return NextResponse.json(
      {
        data,
        message: "Successfully updated balance",
        status: "success",
      } as ResponseType<Wallet>,
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
