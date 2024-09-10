import { cookies } from "next/headers";
import CategoryView from "./CategoryView";
import meta from "@/config/meta.json";

interface ProductFilter {
  name: string;
  value: string;
}

export interface CategoryProduct extends Product {
  image: string;
  filters: ProductFilter[];
  is_favorite: boolean;
}

interface Category {
  title: string;
  products: CategoryProduct[];
}

export interface CategoryFilters {
  [key: string]: { filter: string; selected: boolean }[];
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const data: Category = await fetch(
    process.env.BASE_URL + "/api/categories/" + params.category
  ).then((response) => response.json());

  const products = data.products ?? [];
  const filters: CategoryFilters = {};

  products.map((product) => {
    product.filters.map((filter) => {
      const existing = filters[filter.name] || [];
      if (!existing.find((f) => f.filter == filter.value)) {
        existing[existing.length] = {
          filter: filter.value,
          selected: false,
        };
        filters[filter.name] = existing;
      }
    });
  });

  return (
    <>
      <title>{data.title + meta.titleTemplate}</title>
      <CategoryView
        title={data.title}
        url={params.category}
        products={products}
        filters={filters}
        isLoggedIn={cookies().has("role")}
      />
    </>
  );
}
