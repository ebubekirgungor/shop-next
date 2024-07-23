export const fetchCache = "default-no-store";

import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const res = await fetch("http://localhost/api/v1/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=" + req.cookies.get("jwt")?.value,
    },
    body: JSON.stringify(body),
  });

  return Response.json(await res.json());
}
