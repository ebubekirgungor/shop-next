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

export const GET = handler(user, me);
