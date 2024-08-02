"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";

interface Category {
  id: number | null;
  title: string;
}

interface Product {
  id: number | null;
  title: string;
  url: string;
  category_id: number;
  category: { title: string };
  list_price: number;
  stock_quantity: number;
}

export default function Product({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });

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
              <Select label="Category" value={product?.category_id}>
                {categories.map((category) => (
                  <option value={category.id?.toString()} key={category.id}>
                    {category.title}
                  </option>
                ))}
              </Select>
            </div>
            <Button>Update</Button>
          </form>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
