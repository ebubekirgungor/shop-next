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

async function get(_req: Request) {
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  return NextResponse.json(
    (
      await prisma.user.findUnique({
        where: { id: id },
        include: {
          favorites: {
            select: {
              id: true,
            },
          },
        },
      })
    )?.favorites.map((f) => f.id)!
  );
}

export const GET = handler(user, get);
