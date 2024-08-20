import meiliSearch from "@/lib/meiliSearch";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (query!.length < 2) {
    return Response.json([]);
  }

  const index = meiliSearch.index("products");

  return Response.json(
    (
      await index.search(query, {
        attributesToHighlight: ["title"],
      })
    ).hits.map((hit) => hit._formatted)
  );
}

export async function POST() {
  const index = meiliSearch.index("products");

  return Response.json(
    await index.addDocuments(
      (
        await prisma.product.findMany({
          include: {
            category: {
              select: {
                title: true,
              },
            },
          },
        })
      ).map((product) => {
        return {
          id: product.id,
          title: product.title,
          url: product.url,
          category: product.category.title,
        };
      })
    )
  );
}
