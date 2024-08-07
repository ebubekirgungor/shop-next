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

interface Cart {
  id: number;
  quantity: number;
  selected: boolean;
}

async function add(_req: Request, { params }: { params: { id: string } }) {
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  const user = await prisma.user.findUnique({ where: { id: id } });

  const userCart: Cart[] = JSON.parse(JSON.stringify(user?.cart));

  const productId = Number(params.id);

  const existingItem = userCart.findIndex((item) => item.id === productId);

  if (existingItem !== -1) {
    userCart[existingItem].quantity++;
  } else {
    userCart.push({
      id: productId,
      quantity: 1,
      selected: true,
    });
  }

  await prisma.user.update({
    where: { id: id },
    data: {
      cart: JSON.parse(JSON.stringify(userCart)),
    },
  });

  return NextResponse.json(
    { message: "Product added to cart" },
    {
      status: 200,
    }
  );
}

export const POST = handler(user, add);
