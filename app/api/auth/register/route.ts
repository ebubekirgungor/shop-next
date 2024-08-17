export const fetchCache = "default-no-store";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handleServerError } from "@/lib/errorHandler";

export async function POST(req: NextRequest) {
  const { email, password, first_name, last_name, phone, birth_date, gender } =
    await req.json();

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
        cart: [],
      },
    });

    return NextResponse.json(
      { message: "User created" },
      {
        status: 200,
      }
    );
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return NextResponse.json(
          { message: "User with given e-mail is already exists" },
          {
            status: 409,
          }
        );
      } else {
        return handleServerError(e);
      }
    }
  }
}
