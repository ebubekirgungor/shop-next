"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutTitle from "@/components/LayoutTitle";
import LayoutBox from "@/components/LayoutBox";
import Icon from "@/components/Icon";
import CheckBox from "@/components/CheckBox";
import Button from "@/components/Button";
import { hasCookie } from "cookies-next";
import { jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";

interface ProductFilter {
  name: string;
  value: string;
}

interface CategoryProduct extends Product {
  image: string;
  filters: ProductFilter[];
  is_favorite: boolean;
}

interface Category {
  category_title: string;
  filters: string[];
  products: CategoryProduct[];
}

export default function Category({ params }: { params: { category: string } }) {
  const [category, setCategory] = useState<Category>();
  const [filters, setFilters] = useState<{
    [key: string]: { filter: string; selected: boolean }[];
  }>({});

  const [isLoading, setLoading] = useState(true);

  const selected_filters: { [index: string]: string } = {};

  Object.keys(filters).map((key) => {
    const selected = filters[key].filter((f) => f.selected === true);
    if (selected.length > 0) {
      selected_filters[key] = selected.map((f) => f.filter).join(",");
    }
  });

  useEffect(() => {
    fetch(
      `/api/categories/${params.category}?${new URLSearchParams(
        selected_filters
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCategory(data);
        data.products.map((product: CategoryProduct) => {
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
        setLoading(false);
      });
  }, [filters]);

  function handleChange(key: string, index: number) {
    let filter = filters[key];
    filter[index] = { ...filter[index], selected: !filter[index].selected };

    const newFilters = { ...filters };
    newFilters[key] = filter;

    setFilters(newFilters);
  }

  async function toggleFavorite(id: number, is_favorite: boolean) {
    const response = await jsonFetcher(
      "/api/favorites/" + id,
      is_favorite ? "DELETE" : "POST"
    );

    if (response.status === 200) {
      setCategory({
        ...category!,
        products: category!.products.map((product) => {
          return product.id === id
            ? { ...product, is_favorite: !is_favorite }
            : product;
        }),
      });
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  async function addProductToCart(id: number) {
    const response = await jsonFetcher("/api/cart/" + id, "POST");

    if (response.status === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <>
      <input id="nav" type="checkbox" style={{ display: "none" }} />
      <nav className={styles.nav}>
        <label className={styles.closeButton} htmlFor="nav">
          <Icon name="close" />
        </label>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          Object.keys(filters).map((key) => (
            <div className={styles.filter} key={key}>
              <input
                id={key}
                type="checkbox"
                className={styles.accordionCheckbox}
              />
              <label className={styles.filterName} htmlFor={key}>
                {key}
                <span className={styles.expandIcon} />
              </label>
              <span className={styles.filterValuesContainer}>
                <div className={styles.filterValues}>
                  {filters[key].map((filter, index) => (
                    <CheckBox
                      checked={filter.selected}
                      onChange={() => handleChange(key, index)}
                      label={filter.filter}
                      id={filter.filter}
                      key={filter.filter}
                    />
                  ))}
                </div>
              </span>
            </div>
          ))
        )}
      </nav>
      <LayoutContainer>
        <LayoutTitle>{category?.category_title}</LayoutTitle>
        <LayoutBox minHeight="402px">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={styles.row}>
              {category?.products.map((product) => (
                <div className={styles.product} key={product.id}>
                  {hasCookie("role") && (
                    <button
                      className={styles.favoriteButton}
                      onClick={() =>
                        toggleFavorite(product.id!, product.is_favorite)
                      }
                    >
                      <Icon
                        name={
                          product?.is_favorite ? "favorite_filled" : "favorite"
                        }
                        disableFilter
                      />
                    </button>
                  )}
                  <Link href={"/product/" + product.url}>
                    <Image
                      src={"/images/products/" + product.image}
                      alt={product.image}
                      width="0"
                      height="0"
                      sizes="14rem"
                    />
                    <div className={styles.title}>{product.title}</div>
                  </Link>
                  <div className={styles.column}>
                    <div className={styles.price}>
                      {product.list_price.toLocaleString("tr-TR")} TL
                    </div>
                    <Button
                      className={styles.addToCart}
                      onClick={() => addProductToCart(product.id!)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </LayoutBox>
      </LayoutContainer>
    </>
  );
}
