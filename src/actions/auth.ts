"use server";

import { cookies } from "next/headers";
import prisma from "../../prisma/prisma";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

const salt = genSaltSync(10);

export const createAccount = async ({
  phone,
  password,
  email,
  name,
}: {
  phone: string;
  password: string;
  email: string;
  name: string;
}) => {
  const user = await prisma.user.create({
    data: { phone, password: hashSync(password, salt), email, name },
  });
  return user;
};

export const signIn = async ({
  phone,
  password,
}: {
  phone: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new Error("User not found");
  }
  if (compareSync(password, user.password)) {
    throw new Error("Invalid password");
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

  return user;
};

export const authenticate = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return false;
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const { payload } = await jwtVerify(
    token.value,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  if (!payload) return false;

  const user = await prisma.user.findUnique({
    where: { id: (payload as { id: string }).id },
  });

  return user;
};
