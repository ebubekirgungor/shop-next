export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  cookies().delete("token");
  cookies().delete("role");

  return NextResponse.json(
    { message: "Logout successful" },
    {
      status: 200,
    }
  );
}
