export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import prisma from "@/lib/prisma";
import { user } from "@/app/middleware/auth";

async function get(_req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
  });

  return NextResponse.json(order);
}

export const GET = handler(user, get);
