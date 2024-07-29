export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { admin, user } from "@/app/middleware/auth";
import prisma from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

async function all(_req: Request) {
  return NextResponse.json(
    await prisma.product.findMany({
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

async function create(req: Request) {
  const formData = await req.formData();

  const images: any = formData.get("images");

  const images_json = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const buffer = Buffer.from(await images[i].arrayBuffer());

      const directoryPath = path.join(process.cwd(), "public/images/products");
      const filePath = path.join(directoryPath, images[i].name);

      await mkdir(directoryPath, { recursive: true });

      await writeFile(filePath, buffer);

      images_json.push({
        order: i,
        name: "/images/products/" + images[i].name,
      });
    }
  } catch {
    return NextResponse.json(
      { message: "Images can not uploaded" },
      {
        status: 500,
      }
    );
  }

  try {
    await prisma.product.create({
      data: {
        title: formData.get("title") as string,
        url: formData
          .get("title")!
          .toString()
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("ç", "c")
          .replaceAll("ğ", "g")
          .replaceAll("ı", "i")
          .replaceAll("ö", "o")
          .replaceAll("ş", "s")
          .replaceAll("ü", "u"),
        list_price: Number(formData.get("list_price")),
        stock_quantity: Number(formData.get("stock_quantity")),
        filters: JSON.parse(formData.get("filters") as string),
        images: images_json,
        category_id: Number(formData.get("category_id")),
      },
    });

    return NextResponse.json(
      { message: "Product created" },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}

async function update(req: Request) {
  const formData = await req.formData();

  const images: any = formData.get("images");

  const images_json = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const buffer = Buffer.from(await images[i].arrayBuffer());

      const directoryPath = path.join(process.cwd(), "public/images/products");
      const filePath = path.join(directoryPath, images[i].name);

      await mkdir(directoryPath, { recursive: true });

      await writeFile(filePath, buffer);

      images_json.push({
        order: i,
        name: "/images/products/" + images[i].name,
      });
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
    await prisma.product.update({
      where: { id: Number(formData.get("id")!) },
      data: {
        title: formData.get("title") as string,
        url: formData
          .get("title")!
          .toString()
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("ç", "c")
          .replaceAll("ğ", "g")
          .replaceAll("ı", "i")
          .replaceAll("ö", "o")
          .replaceAll("ş", "s")
          .replaceAll("ü", "u"),
        list_price: Number(formData.get("list_price")),
        stock_quantity: Number(formData.get("stock_quantity")),
        filters: JSON.parse(formData.get("filters") as string),
        images: images_json,
        category_id: Number(formData.get("category_id")),
      },
    });

    return NextResponse.json(
      { message: "Product updated" },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}

async function remove(req: Request) {
  try {
    await prisma.product.delete({
      where: { id: Number((await req.formData()).get("id")) },
    });

    return NextResponse.json(
      { message: "Product deleted" },
      {
        status: 200,
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message },
      {
        status: 500,
      }
    );
  }
}

export const GET = handler(all);
export const POST = handler(user, admin, create);
export const PUT = handler(user, admin, update);
export const DELETE = handler(user, admin, remove);
