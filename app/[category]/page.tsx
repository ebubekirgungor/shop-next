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

export default function Category({ params }: { params: { category: string } }) {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [products, setProducts] = useState<CategoryProduct[]>([]);

  const [filters, setFilters] = useState<{
    [key: string]: { filter: string; selected: boolean }[];
  }>({});

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/categories/${params.category}`)
      .then((response) => response.json())
      .then((data) => {
        setCategoryTitle(data.title);
        setProducts(data.products);
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
  }, []);

  async function filterProducts() {
    const selectedFilters: { [index: string]: string } = {};

    Object.keys(filters).map((key) => {
      const selected = filters[key].filter((f) => f.selected === true);
      if (selected.length > 0) {
        selectedFilters[key] = selected.map((f) => f.filter).join(",");
      }
    });

    await fetch(
      `/api/categories/${params.category}?${new URLSearchParams(
        selectedFilters
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        (document.getElementById("nav") as HTMLInputElement).checked = false;
      });
  }

  async function handleChange(key: string, index: number) {
    let filter = filters[key];
    filter[index] = { ...filter[index], selected: !filter[index].selected };

    const newFilters = { ...filters };
    newFilters[key] = filter;

    setFilters(newFilters);

    if (!(document.getElementById("nav") as HTMLInputElement).checked) {
      await filterProducts();
    }
  }

  async function toggleFavorite(id: number, is_favorite: boolean) {
    const response = await jsonFetcher(
      "/api/favorites/" + id,
      is_favorite ? "DELETE" : "POST"
    );

    if (response.status === 200) {
      setProducts((prev) =>
        prev.map((product) => {
          return product.id === id
            ? { ...product, is_favorite: !is_favorite }
            : product;
        })
      );
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
        <div className={styles.mobileFiltersTitle}>
          Filters
          <label className={styles.closeButton} htmlFor="nav">
            <Icon name="close" />
          </label>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.filtersContainer}>
            {Object.keys(filters).map((key) => (
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
            ))}
          </div>
        )}
        <div className={styles.mobileShowResultsButton}>
          <Button onClick={filterProducts}>Show results</Button>
        </div>
      </nav>
      <LayoutContainer>
        <LayoutTitle>{categoryTitle}</LayoutTitle>
        <LayoutBox minHeight="402px" className={styles.layoutBox}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className={styles.mobileButtons}>
                <label htmlFor="nav">
                  <Icon name="filter" />
                  Filters
                </label>
              </div>
              <div className={styles.row}>
                {products.map((product) => (
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
                            product?.is_favorite
                              ? "favorite_filled"
                              : "favorite"
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
            </>
          )}
        </LayoutBox>
      </LayoutContainer>
    </>
  );
}
