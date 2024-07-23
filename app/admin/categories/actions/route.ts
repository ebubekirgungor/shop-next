export const fetchCache = "default-no-store";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const res = await fetch("http://localhost/api/v1/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=" + req.cookies.get("jwt")?.value,
    },
    body: formData,
  });

  return Response.json(await res.json());
}

export async function PUT(req: NextRequest) {
  const { id, title, url, filters, image } = await req.json();

  const res = await fetch("http://localhost/api/v1/categories/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=" + req.cookies.get("jwt")?.value,
    },
    body: JSON.stringify({
      title,
      url,
      filters,
      image,
    }),
  });

  return Response.json(await res.json());
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  const res = await fetch("http://localhost/api/v1/categories/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jwt=" + req.cookies.get("jwt")?.value,
    },
  });

  return Response.json(await res.json());
}
