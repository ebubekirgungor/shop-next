export const fetchCache = "default-no-store";

import prisma from "@/lib/prisma";
import { SortValue } from "@/lib/types";
import { JsonArray } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";

interface ProductFilter extends JsonArray {
  name: string;
  value: string;
}

type SortProduct = Pick<Product, "created_at" | "list_price">;

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
  const category = await prisma.category.findUnique({
    where: { url: params.url },
    include: {
      products: { where: { active: true } },
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
