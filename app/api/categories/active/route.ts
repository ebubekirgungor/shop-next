export const fetchCache = "default-no-store";

import prisma from "@/lib/prisma";

export async function GET() {
  return Response.json(
    await prisma.category.findMany({
      where: {
        active: true,
        products: {
          some: { active: true },
        },
      },
    })
  );
}
