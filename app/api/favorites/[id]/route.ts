export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";

const {
  V4: { verify },
} = require("paseto");

async function add(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.update({
      where: {
        id: (await verify(cookies().get("token")?.value, getPublicKey())).id,
      },
      data: {
        favorites: { connect: { id: Number(params.id) } },
      },
    });

    return NextResponse.json(
      { message: "Product added to favorites" },
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
    await prisma.user.update({
      where: {
        id: (await verify(cookies().get("token")?.value, getPublicKey())).id,
      },
      data: {
        favorites: { disconnect: { id: Number(params.id) } },
      },
    });

    return NextResponse.json(
      { message: "Product removed from favorites" },
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

export const POST = handler(user, add);
export const DELETE = handler(user, remove);
