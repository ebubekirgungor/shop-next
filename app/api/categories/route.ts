export const fetchCache = "default-no-store";

import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { admin, user } from "@/app/middleware/auth";
import prisma from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { titleToUrl } from "@/lib/utils";

async function all(_req: Request) {
  return NextResponse.json(await prisma.category.findMany());
}

async function create(req: Request) {
  const formData = await req.formData();

  const image: File = formData.get("image") as File;

  if (image) {
    try {
      const buffer = Buffer.from(await image.arrayBuffer());

      const directoryPath = path.join(
        process.cwd(),
        "public/images/categories"
      );
      const filePath = path.join(directoryPath, image.name);

      await mkdir(directoryPath, { recursive: true });

      await writeFile(filePath, buffer);
    } catch {
      return NextResponse.json(
        { message: "Image can not uploaded" },
        {
          status: 500,
        }
      );
    }
  }

  try {
    await prisma.category.create({
      data: {
        title: formData.get("title") as string,
        url: titleToUrl(formData.get("title") as string),
        filters: JSON.parse(formData.get("filters") as string),
        image: "/images/categories/" + (image ? image.name : "category.png"),
      },
    });

    return NextResponse.json(
      { message: "Category created" },
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

  const image: File = formData.get("image") as File;

  if (image) {
    try {
      const buffer = Buffer.from(await image.arrayBuffer());

      const directoryPath = path.join(
        process.cwd(),
        "public/images/categories"
      );
      const filePath = path.join(directoryPath, image.name);

      await mkdir(directoryPath, { recursive: true });

      await writeFile(filePath, buffer);
    } catch {
      return NextResponse.json(
        { message: "Image can not uploaded" },
        {
          status: 500,
        }
      );
    }
  }

  const data: Category = {
    title: formData.get("title") as string,
    url: titleToUrl(formData.get("title") as string),
    filters: JSON.parse(formData.get("filters") as string),
  };

  if (image) data.image = "/images/categories/" + image.name;

  try {
    await prisma.category.update({
      where: { id: Number(formData.get("id")!) },
      data: data as any,
    });

    return NextResponse.json(
      { message: "Category updated" },
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
    await prisma.category.delete({
      where: { id: Number((await req.formData()).get("id")) },
    });

    return NextResponse.json(
      { message: "Category deleted" },
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
