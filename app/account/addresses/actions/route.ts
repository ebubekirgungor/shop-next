export const fetchCache = "default-no-store";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { title, customer_name, address } = await req.json();

  const res = await fetch("http://localhost/api/v1/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=" + req.cookies.get("jwt")?.value,
    },
    body: JSON.stringify({
      title,
      customer_name,
      address,
    }),
  });

  return Response.json(await res.json());
}

export async function PUT(req: NextRequest) {
  const { id, title, customer_name, address } = await req.json();

  const res = await fetch("http://localhost/api/v1/addresses/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=" + req.cookies.get("jwt")?.value,
    },
    body: JSON.stringify({
      title,
      customer_name,
      address,
    }),
  });

  return Response.json(await res.json());
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  const res = await fetch("http://localhost/api/v1/addresses/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=" + req.cookies.get("jwt")?.value,
    },
  });

  return Response.json(await res.json());
}
