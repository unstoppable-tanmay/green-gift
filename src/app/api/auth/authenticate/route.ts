import { ResponseType } from "@/types/common-types";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export const GET = async (request: NextRequest) => {
  try {
    const xUserId = request.headers.get("x-user-id");
    if (!xUserId) {
      return NextResponse.json(
        {
          data: null,
          message: "Can Not Authenticate",
          status: "error",
        } as ResponseType<unknown>,
        { status: 203 }
      );
    }

    const userId = JSON.parse(xUserId).id;

    console.log(userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        addresses: true,
        recentlyViewed: true,
        Wallet: true,
      },
    });

    console.log(user);

    return NextResponse.json(
      {
        data: user,
        message: "Successfully fetched user",
        status: "success",
      } as ResponseType<User>,
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
      { status: 203 }
    );
  }
};
