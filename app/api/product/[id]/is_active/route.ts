export const fetchCache = "default-no-store";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    (
      await prisma.product.findUnique({
        where: { id: Number(params.id) },
      })
    )?.active
  );
}
