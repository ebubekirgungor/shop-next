export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import prisma from "@/lib/prisma";

async function get(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(
    await prisma.product.findUnique({
      where: { id: Number(params.id) },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    })
  );
}

export const GET = handler(get);
