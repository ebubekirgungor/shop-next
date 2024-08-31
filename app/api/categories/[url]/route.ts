export const fetchCache = "default-no-store";

import { getPublicKey } from "@/lib/keyStore";
import prisma from "@/lib/prisma";
import { JsonArray } from "@prisma/client/runtime/library";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const {
  V4: { verify },
} = require("paseto");

interface ProductFilter extends JsonArray {
  name: string;
  value: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { url: string } }
) {
  const token = cookies().get("token")?.value;
  let id = null;

  if (token) {
    try {
      id = (await verify(cookies().get("token")?.value, getPublicKey())).id;
    } catch {}
  }

  let favoriteIds: number[] = [];

  if (token) {
    favoriteIds = (
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
    )?.favorites.map((f) => f.id)!;
  }

  const category = await prisma.category.findUnique({
    where: { url: params.url },
    include: {
      products: true,
    },
  });

  const categoryProducts = category?.products.map((product) => ({
    id: product.id,
    title: product.title,
    url: product.url,
    list_price: product.list_price,
    stock_quantity: product.stock_quantity,
    image: (product.images as string[])[0] ?? "product.png",
    filters: product.filters,
    is_favorite: token && favoriteIds.includes(product.id),
  }));

  const searchParams = req.nextUrl.searchParams;

  if (searchParams.size === 0) {
    return Response.json({
      category_title: category?.title,
      filters: category?.filters,
      products: categoryProducts,
    });
  } else {
    const filters = new Map<string, string[]>();

    searchParams.forEach((value, key) => {
      filters.set(key, value.split(","));
    });

    return Response.json({
      category_title: category?.title,
      filters: category?.filters,
      products: categoryProducts!.filter((product) =>
        (product.filters as ProductFilter[]).some((filter) =>
          filters.get(filter.name)?.includes(filter.value)
        )
      ),
    });
  }
}
