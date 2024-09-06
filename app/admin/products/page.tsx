"use client";
import { useState, useEffect } from "react";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutBox from "@/components/layout/LayoutBox";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DataTable from "@/components/ui/DataTable";
import Chip from "@/components/ui/Chip";
import Link from "next/link";
import styles from "./page.module.css";

const columns = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "category",
    title: "Category",
  },
  {
    key: "list_price",
    title: "List Price",
  },
  {
    key: "stock_quantity",
    title: "Stock Quantity",
  },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <LayoutContainer>
      <LayoutTitle className={styles.layoutTitle}>
        Products
        <Link href="products/create">
          <Chip>Add</Chip>
        </Link>
      </LayoutTitle>
      <LayoutBox minHeight="304px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={products}
            imageUrl="/images/products/"
          />
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
