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

export default function Cart() {
  const [update, setUpdate] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  function handleProductChecked(id: number) {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              cart: {
                ...product.cart,
                selected: !product.cart.selected,
              },
            }
          : product
      )
    );
    setUpdate(true);
  }

  enum Operation {
    increase = 1,
    decrease = -1,
  }

  function handleQuantity(id: number, operation: Operation) {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              cart: {
                ...product.cart,
                quantity: product.cart.quantity + operation,
              },
            }
          : product
      )
    );
    setUpdate(true);
  }

  function handleDelete(id: number) {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
    setUpdate(true);
  }

  async function updateCart() {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: products.map((product) => product.cart) }),
    });

    return response.status === 200;
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      if (update) {
        if (await updateCart()) setUpdate(false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [products, update]);

  return (
    <CartLayout products={products}>
      <LayoutContainer>
        <LayoutTitle>
          Cart
          {!isLoading && (
            <span className={styles.itemsCount}>({products.length} items)</span>
          )}
        </LayoutTitle>
        <LayoutBox minHeight="145px" className={styles.layoutBox}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {products.map((product) => (
                <div className={styles.product} key={product.id}>
                  <div className={styles.row}>
                    <CheckBox
                      checked={product.cart.selected}
                      onChange={() => handleProductChecked(product.id!)}
                    />
                    <Image
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
                        disabled={product.cart.quantity === 1}
                        onClick={() =>
                          handleQuantity(product.id!, Operation.decrease)
                        }
                      >
                        <span>-</span>
                      </button>
                      {product.cart.quantity}
                      <button
                        disabled={
                          product.cart.quantity === product.stock_quantity
                        }
                        onClick={() =>
                          handleQuantity(product.id!, Operation.increase)
                        }
                      >
                        <span>+</span>
                      </button>
                    </div>
                    <h4>{product.list_price + " TL"}</h4>
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
