export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import prisma from "@/lib/prisma";
import { admin, user } from "@/app/middleware/auth";

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

async function update(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.update({
      where: { id: Number(params.id) },
      data: await req.json(),
    });

    return NextResponse.json(
      { message: "Product updated" },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}

async function remove(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Product deleted" },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}

export const GET = handler(get);
export const PUT = handler(user, admin, update);
export const DELETE = handler(user, admin, remove);
