export const fetchCache = "default-no-store";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const {
  V4: { sign, generateKey },
} = require("paseto");

export async function POST(req: NextRequest) {
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

  const token = await sign({ email: email }, await generateKey("public"), {
    expiresIn: remember_me ? "30d" : "1h",
  });

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

  return NextResponse.json(
    { message: "Login successful" },
    {
      status: 200,
    }
  );
}
