export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import prisma from "@/lib/prisma";
import { admin, user } from "@/app/middleware/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { titleToUrl } from "@/lib/utils";
import { handleServerError } from "@/lib/errorHandler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import meiliSearch from "@/lib/meiliSearch";
import { revalidatePath } from "next/cache";

async function get(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(
    await prisma.product.findUnique({
      where: { id: Number(params.id) },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    })
  );
}

async function update(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData();

  const images = formData.getAll("files") as File[];

  try {
    for (let i = 0; i < images.length; i++) {
      const buffer = Buffer.from(await images[i].arrayBuffer());

      const directoryPath = path.join(process.cwd(), "public/images/products");
      const filePath = path.join(directoryPath, images[i].name);

      await mkdir(directoryPath, { recursive: true });

      await writeFile(filePath, buffer);
    }
  } catch {
    return NextResponse.json(
      { message: "Image can not uploaded" },
      {
        status: 500,
      }
    );
  }

  try {
    const url = titleToUrl(formData.get("title") as string) + "-" + params.id;

    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        title: formData.get("title") as string,
        url,
        list_price: Number(formData.get("list_price")),
        stock_quantity: Number(formData.get("stock_quantity")),
        filters: JSON.parse(formData.get("filters") as string),
        images: JSON.parse(formData.get("images") as string),
        category_id: Number(formData.get("category_id")),
      },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });

    meiliSearch.index("products").updateDocuments([
      {
        id: product.id,
        title: product.title,
        url: product.url,
        category: product.category.title,
      },
    ]);

    revalidatePath("/product/" + url);

    return NextResponse.json(
      { message: "Product updated" },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

async function remove(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });

    meiliSearch.index("products").deleteDocument(Number(params.id));

    return NextResponse.json(
      { message: "Product deleted" },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

export const GET = handler(user, admin, get);
export const PUT = handler(user, admin, update);
export const DELETE = handler(user, admin, remove);
