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

async function all(_req: Request) {
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  return NextResponse.json(
    (
      await prisma.user.findUnique({
        where: { id: id },
        include: { favorites: true },
      })
    )?.favorites.map((product) => {
      return {
        id: product.id,
        title: product.title,
        url: product.url,
        list_price: product.list_price,
        image: (product.images as string[])[0] ?? "product.png",
      };
    })
  );
}

export const GET = handler(user, all);
