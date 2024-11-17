import prisma from "../../../../../prisma/prisma";
import { ResponseType } from "@/types/common-types";
import { User } from "@prisma/client";
import { compareSync } from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const PostBodySchema = z.object({
  phone: z
    .string({ message: "Invalid Type" })
    .length(10, { message: "Phone number must be 10 digits" }),
  password: z
    .string({ message: "Invalid Type" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsedBody = PostBodySchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        phone: parsedBody.phone,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          data: null,
          message: "User not found",
          status: "error",
        } as ResponseType<unknown>,
        { status: 404 }
      );
    }

    console.dir(parsedBody);

    if (!compareSync(parsedBody.password, user.password)) {
      return NextResponse.json(
        {
          data: null,
          message: "Invalid password",
          status: "error",
        } as ResponseType<unknown>,
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const jwt = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    const cookieStore = await cookies();
    cookieStore.set("token", jwt);

    return NextResponse.json(
      {
        data: user,
        message: "Successfully fetched user",
        status: "success",
      } as ResponseType<User>,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          data: null,
          status: "error",
        } as ResponseType<unknown>,
        { status: 400 }
      );
    }
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
