"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import Icon from "@/components/Icon";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutTitle from "@/components/LayoutTitle";
import LayoutBox from "@/components/LayoutBox";
import CheckBox from "@/components/CheckBox";
import Link from "next/link";
import CartLayout from "@/components/CartLayout";
import NoItem from "@/components/NoItem";
import { hasCookie, setCookie } from "cookies-next";
import { updateCart } from "@/lib/utils";

enum Operation {
  increase = 1,
  decrease = -1,
}

export default function Cart() {
  const [update, setUpdate] = useState(false);
  const updatePerSecond = 10;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart")
      .then((response) => (response.status === 200 ? response.json() : []))
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  function handleProductChecked(id: number) {
    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              cart: {
                ...product.cart!,
                selected: !product.cart!.selected,
              },
            }
          : product
      )
    );
    setUpdate(true);
  }

  function handleQuantity(id: number, operation: Operation) {
    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              cart: {
                ...product.cart!,
                quantity: product.cart!.quantity + operation,
              },
            }
          : product
      )
    );
    setUpdate(true);
  }

  function handleDelete(id: number) {
    setProducts(products.filter((product) => product.id !== id));
    setUpdate(true);
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      if (update) {
        if (await updateCart(products)) setUpdate(false);
      }
    }, updatePerSecond * 1000);

    return () => clearInterval(interval);
  }, [products, update]);

  return (
    <CartLayout products={products}>
      <LayoutContainer>
        <LayoutTitle>
          Cart
          {!isLoading && products.length !== 0 && (
            <span className={styles.itemsCount}>
              (
              {products.reduce((total: number, product: Product) => {
                return total + product.cart!.quantity;
              }, 0)}{" "}
              items)
            </span>
          )}
        </LayoutTitle>
        <LayoutBox minHeight="145px" className={styles.layoutBox}>
          {isLoading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <NoItem icon="order" description="Your cart is empty" />
          ) : (
            <>
              {products.map((product) => (
                <div className={styles.product} key={product.id}>
                  <div className={styles.row}>
                    <CheckBox
                      checked={product.cart!.selected}
                      onChange={() => handleProductChecked(product.id!)}
                    />
                    <Image
                      className={styles.productImage}
                      src={"/images/products/" + product.images[0]}
                      alt={product.images[0]}
                      width="0"
                      height="0"
                      sizes="6rem"
                    />
                    <Link href={"/product/" + product.url}>
                      {product.title}
                    </Link>
                  </div>
                  <div className={styles.longRow}>
                    <div className={styles.quantityBox}>
                      <button
                        disabled={product.cart?.quantity === 1}
                        onClick={() =>
                          handleQuantity(product.id!, Operation.decrease)
                        }
                      >
                        <span>-</span>
                      </button>
                      {product.cart?.quantity}
                      <button
                        disabled={
                          product.cart?.quantity === product.stock_quantity
                        }
                        onClick={() =>
                          handleQuantity(product.id!, Operation.increase)
                        }
                      >
                        <span>+</span>
                      </button>
                    </div>
                    <h4>
                      {product.list_price * product.cart?.quantity! + " TL"}
                    </h4>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(product.id!)}
                    >
                      <Icon name="delete" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </LayoutBox>
      </LayoutContainer>
    </CartLayout>
  );
}
