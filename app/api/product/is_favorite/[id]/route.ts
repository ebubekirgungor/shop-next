export const fetchCache = "default-no-store";

import { user } from "@/app/middleware/auth";
import { handler } from "@/app/middleware/handler";
import { getPublicKey } from "@/lib/keyStore";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const {
  V4: { verify },
} = require("paseto");

async function get(_req: Request, { params }: { params: { id: string } }) {
  const userId = (await verify(cookies().get("token")?.value, getPublicKey()))
    .id;

  const favoriteIds = (
    await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          select: { id: true },
        },
      },
    })
  )?.favorites.map((f) => f.id);

  return NextResponse.json(favoriteIds?.includes(Number(params.id)));
}

export const GET = handler(user, get);
