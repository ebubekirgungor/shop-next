export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { admin, user } from "@/app/middleware/auth";
import prisma from "@/lib/prisma";

async function all(_req: Request) {
  return NextResponse.json(await prisma.user.findMany());
}

export const GET = handler(user, admin, all);
