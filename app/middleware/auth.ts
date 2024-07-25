import { NextResponse } from "next/server";
import { Middleware } from "./handler";
import { cookies } from "next/headers";
import { getPublicKey } from "@/lib/keyStore";
import { Role } from "@/enums";

const {
  V4: { verify },
} = require("paseto");

export const user: Middleware = async (_req, next) => {
  try {
    await verify(cookies().get("token")?.value, getPublicKey());
  } catch {
    return NextResponse.json(
      { message: "Please log in" },
      {
        status: 401,
      }
    );
  }

  next();
};

export const admin: Middleware = async (_req, next) => {
  if (
    (await verify(cookies().get("token")?.value, getPublicKey())).role !=
    Role.ADMIN
  )
    return NextResponse.json(
      { message: "This operation requires admin role" },
      {
        status: 403,
      }
    );

  next();
};
