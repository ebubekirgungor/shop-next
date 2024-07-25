export const fetchCache = "default-no-store";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Role } from "@/enums";

const {
  V4: { sign },
} = require("paseto");

import { getSecretKey, initializeKeys } from "@/lib/keyStore";

export async function POST(req: NextRequest) {
  if (!getSecretKey()) await initializeKeys();

  const { email, password, remember_me } = await req.json();

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user || !(await bcrypt.compare(password, user?.password!))) {
    return NextResponse.json(
      { message: "E-mail or password was incorrect" },
      {
        status: 401,
      }
    );
  }

  const token = await sign(
    { id: user.id, email: email, role: Role[user.role] },
    getSecretKey(),
    {
      expiresIn: remember_me ? "30d" : "1h",
    }
  );

  const expires = new Date();

  if (remember_me) expires.setDate(expires.getDate() + 30);
  else expires.setHours(expires.getHours() + 1);

  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    expires: expires,
    path: "/",
  });

  cookies().set({
    name: "role",
    value: Role[user.role].toString(),
    expires: expires,
    path: "/",
  });

  return NextResponse.json(
    { message: "Login successful" },
    {
      status: 200,
    }
  );
}
