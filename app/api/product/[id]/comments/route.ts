export const fetchCache = "default-no-store";

import prisma from "@/lib/prisma";
import { getPublicKey } from "@/lib/keyStore";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { handleServerError } from "@/lib/errorHandler";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { handler } from "@/app/middleware/handler";
import { user } from "@/app/middleware/auth";

const {
  V4: { verify },
} = require("paseto");

async function all(_req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
    include: {
      comments: {
        include: {
          author: true,
        },
      },
    },
  });

  return NextResponse.json(
    product?.comments.map((comment) => {
      return {
        date: comment.updated_at,
        content: comment.content,
        star: comment.star,
        author: {
          first_name: (comment.author.first_name[0] ?? "*") + "***",
          last_name: (comment.author.last_name[0] ?? "*") + "***",
        },
      };
    })
  );
}

async function create(req: Request, { params }: { params: { id: string } }) {
  const user_id = (await verify(cookies().get("token")?.value, getPublicKey()))
    .id;

  const { content, star } = await req.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        star,
        author_id: user_id,
        product_id: Number(params.id),
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(
      {
        message: "Comment created",
        body: {
          date: newComment.updated_at,
          content: newComment.content,
          star: newComment.star,
          author: {
            first_name: (newComment.author.first_name[0] ?? "*") + "***",
            last_name: (newComment.author.last_name[0] ?? "*") + "***",
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleServerError(e as PrismaClientKnownRequestError);
  }
}

export const GET = handler(all);
export const POST = handler(user, create);
