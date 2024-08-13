export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handleServerError } from "@/lib/errorHandler";
import { DeliveryStatus } from "@prisma/client";

const {
  V4: { verify },
} = require("paseto");

async function all(_req: Request) {
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  return NextResponse.json(
    (
      await prisma.user.findUnique({
        where: { id: id },
        include: { orders: true },
      })
    )?.orders
  );
}

async function create(req: Request) {
  const user_id = (await verify(cookies().get("token")?.value, getPublicKey()))
    .id;

  const user = await prisma.user.findUnique({ where: { id: user_id } });
  const cart: Cart[] = JSON.parse(JSON.stringify(user?.cart));

  const cartQuantityById = new Map(
    cart
      .filter((filter) => filter.selected === true)
      .map((item) => {
        return [item.id, item.quantity];
      })
  );

  const cartProducts = await prisma.product.findMany({
    where: {
      id: {
        in: Array.from(cartQuantityById.keys()),
      },
    },
  });

  let total_amount = 0;

  const products = cartProducts.map((product) => {
    total_amount += product.list_price * cartQuantityById.get(product.id)!;

    return {
      title: product.title,
      url: product.url,
      list_price: product.list_price,
      image:
        JSON.parse(JSON.stringify(product.images))[0] ??
        "/images/products/product.png",
      quantity: cartQuantityById.get(product.id),
    };
  });

  const { customer_name, delivery_address } = await req.json();

  try {
    await prisma.order.create({
      data: {
        total_amount,
        customer_name,
        delivery_address,
        delivery_status: DeliveryStatus.IN_PROGRESS,
        products,
        user_id,
      },
    });

    return NextResponse.json(
      { message: "Order created" },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

export const GET = handler(user, all);
export const POST = handler(user, create);
