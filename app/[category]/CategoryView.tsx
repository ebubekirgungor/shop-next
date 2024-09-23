"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LayoutBox from "@/components/layout/LayoutBox";
import Icon from "@/components/ui/Icon";
import CheckBox from "@/components/ui/CheckBox";
import Button from "@/components/ui/Button";
import { jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";
import Box from "@/components/ui/Box";
import { SortValue } from "@/lib/types";
import Chip from "@/components/ui/Chip";
import { CategoryFilters, CategoryProduct } from "./page";

const sortValues = [
  {
    name: "Newests",
    value: SortValue.NEWEST,
  },
  {
    name: "Lowest price",
    value: SortValue.LOWEST,
  },
  {
    name: "Highest price",
    value: SortValue.HIGHEST,
  },
];

export default function CategoryView({
  title,
  url,
  products,
  filters,
  isLoggedIn,
}: {
  title: string;
  url: string;
  products: CategoryProduct[];
  filters: CategoryFilters;
  isLoggedIn: boolean;
}) {
  const [productsState, setProductsState] = useState(products);
  const [filtersState, setFiltersState] = useState(filters);

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/users/favorite_ids")
        .then((response) => response.json())
        .then((data) => {
          setFavoriteIds(data);
        });
    }
  }, []);

  async function filterProducts(sortValue?: SortValue) {
    const selectedFilters: { [index: string]: string } = {};

    Object.keys(filters).map((key) => {
      const selected = filters[key].filter((f) => f.selected === true);
      if (selected.length > 0) {
        selectedFilters[key] = selected.map((f) => f.filter).join(",");
      }
    });

    if (sortValue) selectedFilters["_sort"] = sortValue;

    if (Object.keys(selectedFilters).length === 0) {
      setProductsState(products);
    } else {
      await fetch(
        `/api/categories/${url}?${new URLSearchParams(selectedFilters)}`
      )
        .then((response) => response.json())
        .then((data) => {
          setProductsState(data.products);
          (document.getElementById("nav") as HTMLInputElement).checked = false;
        });
    }
  }

  async function handleChange(key: string, index: number) {
    let filter = filters[key];
    filter[index] = { ...filter[index], selected: !filter[index].selected };

    const newFilters = { ...filters };
    newFilters[key] = filter;

    setFiltersState(newFilters);

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
      setFavoriteIds((prev) =>
        is_favorite ? prev.filter((item) => item !== id) : [...prev, id]
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
        <div className={styles.filtersContainer}>
          <div className={styles.mobileSortMenu}>
            {sortValues.map((sort) => (
              <Chip onClick={() => filterProducts(sort.value)} key={sort.value}>
                {sort.name}
              </Chip>
            ))}
          </div>
          {Object.keys(filtersState).map((key) => (
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
                  {filtersState[key].map((filter, index) => (
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

        <div className={styles.mobileShowResultsButton}>
          <Button onClick={() => filterProducts()}>Show results</Button>
        </div>
      </nav>
      <LayoutContainer>
        <LayoutTitle className={styles.layoutTitle}>
          {title}
          <div className={styles.sortContainer}>
            <button className={styles.sortButton}>
              Sort
              <Icon name="sort" />
            </button>
            <Box className={styles.sortValues}>
              {sortValues.map((sort) => (
                <div
                  onClick={() => filterProducts(sort.value)}
                  key={sort.value}
                >
                  {sort.name}
                </div>
              ))}
            </Box>
          </div>
        </LayoutTitle>
        <LayoutBox minHeight="454px" className={styles.layoutBox}>
          <div className={styles.mobileButtons}>
            <label htmlFor="nav">
              <Icon name="filter" />
              Filters
            </label>
          </div>
          <div className={styles.row}>
            {productsState.map((product) => (
              <div className={styles.product} key={product.id}>
                {isLoggedIn && (
                  <button
                    className={styles.favoriteButton}
                    onClick={() =>
                      toggleFavorite(
                        product.id!,
                        favoriteIds.includes(product.id!)
                      )
                    }
                  >
                    <Icon
                      name={
                        favoriteIds.includes(product.id!)
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
        </LayoutBox>
      </LayoutContainer>
    </>
  );
}
