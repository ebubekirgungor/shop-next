export const fetchCache = "default-no-store";

import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { url: string } }
) {
  return Response.json(
    await prisma.product.findUnique({
      where: { url: params.url },
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
