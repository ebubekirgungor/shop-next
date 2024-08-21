export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handleServerError } from "@/lib/errorHandler";

const {
  V4: { verify },
} = require("paseto");

async function cart(_req: Request) {
  const token = cookies().get("token")?.value;

  let cart: Cart[] = [];

  if (token) {
    try {
      const id = (await verify(token, getPublicKey())).id;
      const user = await prisma.user.findUnique({ where: { id: id } });

      cart = JSON.parse(JSON.stringify(user?.cart));
    } catch {}
  } else {
    cart = JSON.parse(cookies().get("cart")?.value || JSON.stringify([]));
  }

  const cartDataById = new Map(
    cart.map((item) => {
      return [item.id, item];
    })
  );

  const products = await prisma.product.findMany({
    where: {
      id: { in: cart.map((item) => item.id) },
    },
  });

  return NextResponse.json(
    (products as Product[]).map((product) => {
      return {
        id: product.id,
        title: product.title,
        url: product.url,
        list_price: product.list_price,
        stock_quantity: product.stock_quantity,
        image: (product.images as string[])[0] ?? "product.png",
        cart: cartDataById.get(product.id!),
      };
    })
  );
}

async function update(req: Request) {
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  const { cart } = await req.json();

  try {
    await prisma.user.update({
      where: { id: id },
      data: {
        cart,
      },
    });

    return NextResponse.json(
      { message: "Cart updated" },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

export const GET = handler(cart);
export const POST = handler(user, update);
