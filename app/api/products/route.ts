export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { admin, user } from "@/app/middleware/auth";
import prisma from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { titleToUrl } from "@/lib/utils";
import { handleServerError } from "@/lib/errorHandler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

async function all(_req: Request) {
  return NextResponse.json(
    (
      await prisma.product.findMany({
        include: {
          category: {
            select: {
              title: true,
            },
          },
        },
      })
    ).map((product) => {
      return {
        id: product.id,
        title: product.title,
        url: product.url,
        list_price: product.list_price,
        stock_quantity: product.stock_quantity,
        category: product.category.title,
      };
    })
  );
}

async function create(req: Request) {
  const formData = await req.formData();

  const images: File[] = formData.getAll("files") as File[];

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
    await prisma.product.create({
      data: {
        title: formData.get("title") as string,
        url: titleToUrl(formData.get("title") as string),
        list_price: Number(formData.get("list_price")),
        stock_quantity: Number(formData.get("stock_quantity")),
        filters: JSON.parse(formData.get("filters") as string),
        images: JSON.parse(formData.get("images") as string),
        category_id: Number(formData.get("category_id")),
      },
    });

    return NextResponse.json(
      { message: "Product created" },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

export const GET = handler(all);
export const POST = handler(user, admin, create);
