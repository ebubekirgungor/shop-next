"use client";
import { ChangeEvent, useState } from "react";
import Box from "../Box";
import styles from "./NavSearch.module.css";
import Link from "next/link";

interface SearchedProduct {
  id: number;
  title: string;
  url: string;
  category: string;
}

const NavSearch = () => {
  const [searchedData, setSearchedData] = useState<SearchedProduct[]>([]);

  async function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    fetch(`/api/search?q=${e.target.value}`)
      .then((response) => response.status === 200 && response.json())
      .then((data) => {
        setSearchedData(data);
      });
  }

  return (
    <div className={styles.search}>
      <input placeholder="Search products" onChange={handleSearch} />
      <Box
        className={`${styles.searchBox} ${
          searchedData.length === 0 && styles.invisible
        }`}
      >
        {searchedData.map((data) => (
          <div key={data.id}>
            <Link href={"/product/" + data.url}>
              <div dangerouslySetInnerHTML={{ __html: data.title }} />
              <span>{data.category}</span>
            </Link>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default NavSearch;
