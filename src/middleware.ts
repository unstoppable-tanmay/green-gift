import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { MiddlewareConfig, NextRequest } from "next/server";
import { errorType } from "./types/common-types";

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;

    const token = request.cookies.get("token");

    if (!token) {
      if (!path.startsWith("/api/")) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
      return NextResponse.json(
        {
          message: "Unauthorized",
          status: "error",
        },
        { status: 203 }
      );
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    if (!payload) return false;

    const response = NextResponse.next();

    response.headers.set("x-user-id", JSON.stringify(payload));

    // const userData = JSON.parse(req.headers.get('x-user-id'));

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as errorType).message || "Unauthorized",
        status: "error",
      },
      { status: 400 }
    );
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    "/cart",
    "/orders",
    "/wallet",
    "/api/cart",
    "/api/auth/authenticate",
  ],
};
