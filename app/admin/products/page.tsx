"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import Dialog from "@/components/Dialog";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { DataTable } from "@/components/DataTable";

interface Product {
  id: number | null;
  title: string;
  url: string;
  category: { title: string };
  list_price: number;
  stock_quantity: number;
}

const columns = [
  {
    key: "title",
    title: "Title",
  },
  {
    key: "category.title",
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

  async function getAllProducts() {
    await fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  const [dialog, setDialog] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number>();

  function openDialog(id: number) {
    setDialogStatus(true);
    setDialog(true);
    setDeleteProductId(id);
  }

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => setDialog(false), 300);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/products/" + deleteProductId, {
      method: "DELETE",
    });

    if (response.status == 200) {
      await getAllProducts();
      closeDialog();
    }
  }

  return (
    <LayoutContainer>
      <LayoutTitle>Products</LayoutTitle>
      <LayoutBox minHeight="274px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={columns} data={products}></DataTable>
        )}
        {dialog && (
          <Dialog
            title="Delete category"
            close={closeDialog}
            status={dialogStatus}
          >
            <form onSubmit={onSubmit}>
              <div style={{ textAlign: "center" }}>Are you sure?</div>
              <Button>Delete</Button>
            </form>
          </Dialog>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
