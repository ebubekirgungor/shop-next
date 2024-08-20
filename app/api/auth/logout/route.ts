export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  cookies().delete("token");
  cookies().delete("role");

  return NextResponse.redirect(new URL("/account/personal-details", req.url));
}
