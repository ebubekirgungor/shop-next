export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";
import { handleServerError } from "@/lib/errorHandler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
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
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

export const POST = handler(user, add);
export const DELETE = handler(user, remove);
