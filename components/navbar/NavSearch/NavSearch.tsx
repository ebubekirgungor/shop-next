"use client";
import { ChangeEvent, useState } from "react";
import Box from "../../ui/Box";
import styles from "./NavSearch.module.css";
import Link from "next/link";
import DOMPurify from "dompurify";
import Icon from "../../ui/Icon";

type SearchedProduct = Pick<Product, "id" | "title" | "url"> & {
  category: string;
};

const NavSearch = () => {
  const [searchedData, setSearchedData] = useState<SearchedProduct[]>([]);

  async function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 1) {
      fetch(`/api/search?q=${e.target.value}`)
        .then((response) => response.status === 200 && response.json())
        .then((data) => {
          setSearchedData(data);
        });
    } else {
      setSearchedData([]);
    }
  }

  return (
    <div className={styles.search}>
      <label className={styles.previousButton} htmlFor="search">
        <Icon name="previous" />
      </label>
      <input placeholder="Search products" onChange={handleSearch} />
      <Box
        className={`${styles.searchBox} ${
          searchedData.length === 0 && styles.invisible
        }`}
      >
        {searchedData.map((data) => (
          <div key={data.id}>
            <Link
              href={"/product/" + data.url}
              onClick={() =>
                ((
                  document.getElementById("search") as HTMLInputElement
                ).checked = false)
              }
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.title),
                }}
              />
              <span>{data.category}</span>
            </Link>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default NavSearch;
