export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handleServerError } from "@/lib/errorHandler";

const {
  V4: { verify },
} = require("paseto");

async function all(_req: Request) {
  const id = (await verify(cookies().get("token")?.value, getPublicKey())).id;

  return NextResponse.json(
    (
      await prisma.user.findUnique({
        where: { id: id },
        include: { addresses: true },
      })
    )?.addresses
  );
}

async function create(req: Request) {
  const user_id = (await verify(cookies().get("token")?.value, getPublicKey()))
    .id;

  const { title, customer_name, address } = await req.json();

  try {
    const newAddress = await prisma.address.create({
      data: {
        title,
        customer_name,
        address,
        user_id,
      },
    });

    return NextResponse.json(
      { message: "Address created", body: newAddress },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

async function update(req: Request) {
  const { id, title, customer_name, address } = await req.json();

  try {
    await prisma.address.update({
      where: { id: id },
      data: {
        title,
        customer_name,
        address,
      },
    });

    return NextResponse.json(
      { message: "Address updated" },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

async function remove(req: Request) {
  const { id } = await req.json();

  try {
    await prisma.address.delete({ where: { id: id } });

    return NextResponse.json(
      { message: "Address deleted" },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

export const GET = handler(user, all);
export const POST = handler(user, create);
export const PUT = handler(user, update);
export const DELETE = handler(user, remove);
