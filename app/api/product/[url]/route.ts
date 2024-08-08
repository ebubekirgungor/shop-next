export const fetchCache = "default-no-store";

import { getPublicKey } from "@/lib/keyStore";
import prisma from "@/lib/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { cookies } from "next/headers";

const {
  V4: { verify },
} = require("paseto");

interface Product {
  id: number;
  title: string;
  url: string;
  list_price: number;
  stock_quantity: number;
  images: JsonValue;
  filters: JsonValue;
  category_id: number;
  Users?: { id: number }[];
  is_favorite?: boolean;
}

export async function GET(
  _req: Request,
  { params }: { params: { url: string } }
) {
  const token = cookies().get("token")?.value;
  let id = null;

  if (token) {
    try {
      id = (await verify(cookies().get("token")?.value, getPublicKey())).id;
    } catch {}
  }

  const product = await prisma.product.findUnique({
    where: { url: params.url },
    include: {
      category: {
        select: {
          title: true,
        },
      },
      Users: {
        select: id
          ? {
              id: true,
            }
          : null,
      },
    },
  });

  if (token) {
    (product as Product)!.is_favorite = product?.Users.some(
      (user) => user.id === id
    );

    delete (product as Product).Users;
  }

  return Response.json(product);
}
