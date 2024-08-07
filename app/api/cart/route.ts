export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";
import { JsonValue } from "@prisma/client/runtime/library";

const {
  V4: { verify },
} = require("paseto");

interface Cart {
  id: number;
  quantity: number;
  selected: boolean;
}

interface Product {
  id: number;
  title: string;
  url: string;
  list_price: number;
  stock_quantity: number;
  images: JsonValue;
  filters: JsonValue;
  category_id: number;
  cart?: Cart;
}

async function cart(_req: Request) {
  const email = (await verify(cookies().get("token")?.value, getPublicKey()))
    .email;

  const user = await prisma.user.findUnique({ where: { email: email } });

  const userCart: Cart[] = JSON.parse(JSON.stringify(user?.cart));

  const cartDataById = new Map(
    userCart.map((item) => {
      return [item.id, item];
    })
  );

  const products = await prisma.product.findMany({
    where: {
      id: { in: userCart.map((item) => item.id) },
    },
  });

  return NextResponse.json(
    products.map((product: Product) => {
      product.cart = cartDataById.get(product.id);
      return product;
    })
  );
}

async function update(req: Request) {
  const email = (await verify(cookies().get("token")?.value, getPublicKey()))
    .email;

  const { cart } = await req.json();

  try {
    await prisma.user.update({
      where: { email: email },
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
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}

export const GET = handler(user, cart);
export const POST = handler(user, update);
