import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export function handleServerError(e: PrismaClientKnownRequestError) {
  return NextResponse.json(
    { message: e.message },
    {
      status: 500,
    }
  );
}
