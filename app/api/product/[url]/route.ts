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
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  const product = await prisma.product.findUnique({
    where: { url: params.url },
    include: {
      category: {
        select: {
          title: true,
        },
      },
      Users: {
        select: {
          id: true,
        },
      },
    },
  });

  (product as Product)!.is_favorite = product?.Users.some(
    (user) => user.id === id
  );

  delete (product as Product).Users;

  return Response.json(product);
}
