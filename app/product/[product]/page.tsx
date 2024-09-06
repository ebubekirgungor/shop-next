import { cookies } from "next/headers";
import ProductView from "./ProductView";

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

  return <ProductView product={data} isLoggedIn={cookies().has("role")} />;
}
