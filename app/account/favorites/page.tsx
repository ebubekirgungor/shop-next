"use client";
import { useState, useEffect, FormEvent } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

import { toast } from "react-toastify";
import { jsonFetcher } from "@/lib/fetchers";

import {
  LayoutContainer,
  LayoutTitle,
  LayoutBox,
  Meta,
} from "@/components/layout";
import { Button, Dialog, Icon, LoadingSpinner, NoItem } from "@/components/ui";

interface FavoriteProduct extends Product {
  image: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setLoading] = useState(true);

  async function getFavorites() {
    await fetch("/api/favorites")
      .then((response) => (response.status === 200 ? response.json() : []))
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    getFavorites();
  }, []);

  const [dialog, setDialog] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [productToRemove, setProductToRemove] = useState<number>();

  function openDialog(product: number) {
    setProductToRemove(product);
    setDialogStatus(true);
    setDialog(true);
  }

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => setDialog(false), 300);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await jsonFetcher(
      "/api/favorites/" + productToRemove,
      "DELETE"
    );

    closeDialog();

    if (response.status === 200) {
      setFavorites((prevProducts) =>
        prevProducts.filter((product) => product.id !== productToRemove)
      );
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <LayoutContainer>
      <LayoutTitle>
        <Meta title="Favorites" />
      </LayoutTitle>
      <LayoutBox minHeight="402px">
        {isLoading ? (
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <NoItem icon="favorite" description="You don't have a favorite yet" />
        ) : (
          <div className={styles.row}>
            {favorites.map((product) => (
              <div className={styles.product} key={product.id}>
                <button onClick={() => openDialog(product.id!)}>
                  <Icon name="delete" />
                </button>
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
                <div className={styles.price}>
                  {product.list_price.toLocaleString("tr-TR")} TL
                </div>
              </div>
            ))}
          </div>
        )}
        {dialog && (
          <Dialog
            title="Remove product from favorites"
            close={closeDialog}
            status={dialogStatus}
          >
            <form onSubmit={onSubmit}>
              <div style={{ textAlign: "center" }}>Are you sure?</div>
              <Button>Remove</Button>
            </form>
          </Dialog>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
