export const fetchCache = "default-no-store";

import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  });

  if ((product?.images as string[]).length === 0) {
    product!.images = ["product.png"];
  }

  return Response.json(product);
}
