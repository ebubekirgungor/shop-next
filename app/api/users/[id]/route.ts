export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import prisma from "@/lib/prisma";
import { admin, user } from "@/app/middleware/auth";
import { Role } from "@/lib/enums";

async function get(_req: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({
    email: user?.email,
    first_name: user?.first_name,
    last_name: user?.last_name,
    phone: user?.phone,
    birth_date: {
      day: user?.birth_date.split("-")[2],
      month: user?.birth_date.split("-")[1],
      year: user?.birth_date.split("-")[0],
    },
    gender: user?.gender.toString(),
    role: Role[user?.role!],
  });
}

async function update(req: Request, { params }: { params: { id: string } }) {
  const { email, first_name, last_name, phone, birth_date, gender, role } =
    await req.json();

  try {
    await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        email,
        first_name,
        last_name,
        phone,
        birth_date: birth_date,
        gender: gender === "true",
        role,
      },
    });

    return NextResponse.json(
      { message: "User updated" },
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
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "User deleted" },
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

export const GET = handler(user, admin, get);
export const PUT = handler(user, admin, update);
export const DELETE = handler(user, admin, remove);
