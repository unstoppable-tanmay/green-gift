import { ResponseType } from "@/types/common-types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json(
      {
        data: null,
        message: "Successfully log out",
        status: "success",
      } as ResponseType<unknown>,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
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
