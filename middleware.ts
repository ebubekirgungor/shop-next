import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const role = request.cookies.get("role")?.value;

  if (
    (pathName.startsWith("/account") || pathName.startsWith("/admin")) &&
    !role
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathName.startsWith("/admin") && role === "0") {
    return NextResponse.redirect(
      new URL("/account/personal-details", request.url)
    );
  }
}
