"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Link from "next/link";
import Icon from "@/components/Icon";
import Dialog from "@/components/Dialog";
import { useRouter } from "next/navigation";

interface Category {
  id: number | null;
  title: string;
  filters: string[];
}

interface Filter {
  name: string;
  value: string;
}

interface Product {
  id: number | null;
  title: string;
  url: string;
  category_id: number;
  category: { title: string };
  list_price: number;
  stock_quantity: number;
  filters: Filter[];
}

export default function Product({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);

  const [oldProduct, setOldProduct] = useState<{
    category_id: number;
    filters: Filter[];
  }>();

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });

    fetch("/api/products/" + params.id)
      .then((response) => response.json())
      .then((data) => {
        setOldProduct({
          category_id: data.category_id,
          filters: data.filters,
        });
        setProduct(data);
        setLoading(false);
      });
  }, []);

  const [dialog, setDialog] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);

  function openDialog() {
    setDialogStatus(true);
    setDialog(true);
  }

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => setDialog(false), 300);
  }

  function handleProduct(e: ChangeEvent<HTMLInputElement>) {
    const copy = { ...product } as any;
    const value = e.target.value;
    copy[e.target.name] = isNaN(Number(value)) ? value : Number(value);
    setProduct(copy);
  }

  function handleCategory(e: ChangeEvent<HTMLSelectElement>) {
    const category_id = Number(e.target.value);
    const filters: Filter[] = [];

    categories
      .find((category) => category.id === category_id)
      ?.filters.map((filter: string) =>
        filters.push({
          name: filter,
          value: "",
        })
      );

    setProduct((prevState) => ({
      ...prevState!,
      filters:
        category_id === oldProduct?.category_id ? oldProduct.filters : filters,
      category_id,
    }));
  }

  function handleFilter(e: ChangeEvent<HTMLInputElement>, index: number) {
    const copy = { ...product } as any;
    copy["filters"][index].value = e.target.value;
    setProduct(copy);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch("/api/products/" + params.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: product?.title,
        url: product?.title
          .toLowerCase()
          .replaceAll(" ", "-")
          .replaceAll("ç", "c")
          .replaceAll("ğ", "g")
          .replaceAll("ı", "i")
          .replaceAll("ö", "o")
          .replaceAll("ş", "s")
          .replaceAll("ü", "u"),
        list_price: product?.list_price,
        stock_quantity: product?.stock_quantity,
        category_id: product?.category_id,
        filters: product?.filters,
      }),
    });
  }

  async function onDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/products/" + params.id, {
      method: "DELETE",
    });

    if (response.status == 200) {
      router.push("/admin/products");
    }
  }

  return (
    <LayoutContainer>
      <LayoutTitle style={{ paddingLeft: "1rem" }}>
        <Link href={"/admin/products"} className={styles.previousButton}>
          <Icon name="previous" />
        </Link>
        Edit Product
      </LayoutTitle>
      <LayoutBox minHeight="220px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.grid}>
              <Input
                label="Title"
                type="text"
                name="title"
                value={product?.title}
                onChange={handleProduct}
              />
              <Input
                label="List price"
                step=".01"
                type="number"
                min="1"
                name="list_price"
                value={product?.list_price}
                onChange={handleProduct}
              />
              <Input
                label="Stock quantity"
                type="number"
                min="0"
                name="stock_quantity"
                value={product?.stock_quantity}
                onChange={handleProduct}
              />
              <Select
                label="Category"
                value={product?.category_id}
                onChange={handleCategory}
              >
                {categories.map((category) => (
                  <option value={category.id?.toString()} key={category.id}>
                    {category.title}
                  </option>
                ))}
              </Select>
              {product?.filters.map((filter, index) => (
                <Input
                  label={filter.name}
                  key={index}
                  value={filter.value}
                  onChange={(e) => handleFilter(e, index)}
                />
              ))}
            </div>
            <Button>Update</Button>
            <Button
              className={styles.deleteButton}
              type="button"
              onClick={openDialog}
            >
              Delete
            </Button>
          </form>
        )}
        {dialog && (
          <Dialog
            title="Delete product"
            close={closeDialog}
            status={dialogStatus}
          >
            <form onSubmit={onDeleteSubmit}>
              <div style={{ textAlign: "center" }}>Are you sure?</div>
              <Button>Delete</Button>
            </form>
          </Dialog>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
