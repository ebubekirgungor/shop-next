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
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  const user = await prisma.user.findUnique({ where: { id: id } });

  return NextResponse.json({
    email: user?.email,
    first_name: user?.first_name,
    last_name: user?.last_name,
    phone: user?.phone,
    birth_date: {
      day: user?.birth_date.split("-")[2],
      month: user?.birth_date.split("-")[1],
      year: user?.birth_date.split("-")[0],
    },
    gender: user?.gender.toString(),
  });
}

async function update(req: Request) {
  const { first_name, last_name, phone, birth_date, gender } = await req.json();

  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  try {
    await prisma.user.update({
      where: { id: id },
      data: {
        first_name,
        last_name,
        phone,
        birth_date: birth_date,
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
