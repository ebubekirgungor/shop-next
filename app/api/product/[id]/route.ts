export const fetchCache = "default-no-store";

import { getPublicKey } from "@/lib/keyStore";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const {
  V4: { verify },
} = require("paseto");

interface ProductWithUsers extends Product {
  Users?: { id: number }[];
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("token")?.value;
  let id = null;

  if (token) {
    try {
      id = (await verify(cookies().get("token")?.value, getPublicKey())).id;
    } catch {}
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
    include: id
      ? {
          Users: {
            select: {
              id: true,
            },
          },
        }
      : null,
  });

  if (token) {
    (product as ProductWithUsers).is_favorite = (
      product as ProductWithUsers
    ).Users!.some((user) => user.id === id);

    delete (product as ProductWithUsers).Users;
  }

  if ((product?.images as string[]).length === 0) {
    product!.images = ["product.png"];
  }

  return Response.json(product);
}
