export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";

const {
  V4: { verify },
} = require("paseto");

async function me(_req: Request) {
  const email = (await verify(cookies().get("token")?.value, getPublicKey()))
    .email;

  return NextResponse.json(
    await prisma.user.findUnique({ where: { email: email } })
  );
}

async function update(req: Request) {
  const { first_name, last_name, phone, birth_date, gender } = await req.json();

  const email = (await verify(cookies().get("token")?.value, getPublicKey()))
    .email;

  try {
    await prisma.user.update({
      where: { email: email },
      data: {
        first_name,
        last_name,
        phone,
        birth_date: new Date(birth_date),
        gender: gender === "true",
      },
    });

    return NextResponse.json(
      { message: "User updated" },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}

export const GET = handler(user, me);
export const PUT = handler(user, update);
