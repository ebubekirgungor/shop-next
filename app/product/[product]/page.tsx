import { cookies } from "next/headers";
import ProductView from "./ProductView";
import meta from "@/config/meta.json";

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

  return (
    <>
      <title>{data.title + meta.titleTemplate}</title>
      <ProductView product={data} isLoggedIn={cookies().has("role")} />
    </>
  );
}
