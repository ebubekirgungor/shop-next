export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { admin, user } from "@/app/middleware/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function all(_req: Request) {
  return NextResponse.json(await prisma.user.findMany());
}

async function create(req: Request) {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    birth_date,
    gender,
    role,
  } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 14);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
        birth_date,
        gender: gender === "true",
        role,
        cart: [],
      },
    });

    return NextResponse.json(
      { message: "User created" },
      {
        status: 201,
      }
    );
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { message: "User with given e-mail is already exists" },
        {
          status: 409,
        }
      );
    } else {
      return NextResponse.json(
        { message: e.message },
        {
          status: 500,
        }
      );
    }
  }
}

export const GET = handler(user, admin, all);
export const POST = handler(user, admin, create);
