"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface Product {
  id: number | null;
  title: string;
  url: string;
  category: string;
  list_price: number;
  stock_quantity: number;
}

export default function Product({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/" + params.id)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, []);

  return (
    <LayoutContainer>
      <LayoutTitle>Products</LayoutTitle>
      <LayoutBox minHeight="220px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form>
            <div className={styles.row}>
              <Input
                label="Title"
                type="text"
                name="title"
                value={product?.title}
              />
              <Input
                label="List price"
                type="text"
                name="list_price"
                value={product?.list_price}
              />
            </div>
            <div className={styles.row}>
              <Input
                label="Stock quantity"
                type="text"
                name="stock_quantity"
                value={product?.stock_quantity}
              />
            </div>
            <Button>Update</Button>
          </form>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
