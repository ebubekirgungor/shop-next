export const fetchCache = "default-no-store";

import { getPublicKey } from "@/lib/keyStore";
import prisma from "@/lib/prisma";
import { SortValue } from "@/lib/types";
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

interface SortProduct {
  created_at: Date;
  list_price: number;
}

const sortFunctions = {
  [SortValue.NEWEST]: (a: SortProduct, b: SortProduct) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  [SortValue.LOWEST]: (a: SortProduct, b: SortProduct) =>
    a.list_price - b.list_price,
  [SortValue.HIGHEST]: (a: SortProduct, b: SortProduct) =>
    b.list_price - a.list_price,
};

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

  let categoryProducts = category?.products.map((product) => ({
    created_at: product.created_at,
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

  const filters = new Map<string, string[]>();

  const sortValue = searchParams.get("_sort")! as SortValue;
  searchParams.delete("_sort");

  searchParams.forEach((value, key) => {
    filters.set(key, value.split(","));
  });

  if (filters.size > 0) {
    categoryProducts = categoryProducts!.filter((product) =>
      (product.filters as ProductFilter[]).some((filter) =>
        filters.get(filter.name)?.includes(filter.value)
      )
    );
  }

  if (sortValue) {
    categoryProducts = categoryProducts!.sort(sortFunctions[sortValue]);
  }

  return Response.json({
    title: category?.title,
    products: categoryProducts,
  });
}
