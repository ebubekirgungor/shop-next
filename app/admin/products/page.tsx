"use client";
import { useState, useEffect } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import DataTable from "@/components/DataTable";
import Chip from "@/components/Chip";
import Link from "next/link";

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
      <LayoutTitle>
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
