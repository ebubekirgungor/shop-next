export const fetchCache = "default-no-store";

import prisma from "@/lib/prisma";
import { JsonArray } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";

interface ProductFilter extends JsonArray {
  name: string;
  value: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { url: string } }
) {
  const category = await prisma.category.findUnique({
    where: { url: params.url },
    include: {
      products: true,
    },
  });

  const searchParams = req.nextUrl.searchParams;

  if (searchParams.size === 0) {
    return Response.json({
      category_title: category?.title,
      filters: category?.filters,
      products: category?.products,
    });
  } else {
    const filters = new Map<string, string[]>();

    searchParams.forEach((value, key) => {
      filters.set(key, value.split(","));
    });

    return Response.json({
      category_title: category?.title,
      filters: category?.filters,
      products: category?.products
        .filter((product) =>
          (product.filters as ProductFilter[]).some((filter) =>
            filters.get(filter.name)?.includes(filter.value)
          )
        )
        .map((product) => ({
          id: product.id,
          title: product.title,
          url: product.url,
          list_price: product.list_price,
          stock_quantity: product.stock_quantity,
          image: (product.images as string[])[0] ?? "product.png",
          filters: product.filters,
        })),
    });
  }
}
