import { cookies } from "next/headers";
import CategoryView from "./CategoryView";
import meta from "@/config/meta.json";
import { notFound } from "next/navigation";

interface ProductFilter {
  name: string;
  value: string;
}

export interface CategoryProduct extends Product {
  image: string;
  filters: ProductFilter[];
  is_favorite: boolean;
}

type CategoryWithProducts = Pick<Category, "title"> & {
  products: CategoryProduct[];
  active: boolean;
};

export interface CategoryFilters {
  [key: string]: { filter: string; selected: boolean }[];
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const data: CategoryWithProducts = await fetch(
    process.env.BASE_URL + "/api/categories/" + params.category
  ).then((response) => response.json());

  if (!data.active || !data.products.length) {
    return notFound();
  }

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
