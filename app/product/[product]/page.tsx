import { cookies } from "next/headers";
import Product from "./Product";

export default async function ProductPage({
  params,
}: {
  params: { product: string };
}) {
  const id = params.product.match(/-(\d+)$/)![1];

  const data: Product = await fetch(
    process.env.BASE_URL + "/api/product/" + id,
    {
      next: { tags: ["product-" + id] },
    }
  ).then((response) => response.json());

  return <Product product={data} isLoggedIn={cookies().has("role")} />;
}
