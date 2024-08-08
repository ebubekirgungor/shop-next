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

async function add(_req: Request, { params }: { params: { id: string } }) {
  const token = cookies().get("token")?.value;
  let id;

  let cart: Cart[] = [];

  if (token) {
    try {
      id = (await verify(token, getPublicKey())).id;
      const user = await prisma.user.findUnique({ where: { id: id } });

      cart = JSON.parse(JSON.stringify(user?.cart));
    } catch {}
  } else {
    cart = JSON.parse(cookies().get("cart")?.value! || "[]");
  }

  const productId = Number(params.id);
  const existingItem = cart.findIndex((item) => item.id === productId);

  if (existingItem !== -1) {
    cart[existingItem].quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1,
      selected: true,
    });
  }

  if (token) {
    await prisma.user.update({
      where: { id: id },
      data: {
        cart: JSON.parse(JSON.stringify(cart)),
      },
    });
  } else {
    cookies().set({
      name: "cart",
      value: JSON.stringify(cart),
      path: "/",
    });
  }

  return NextResponse.json(
    { message: "Product added to cart" },
    {
      status: 200,
    }
  );
}

export const POST = handler(add);
