"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LayoutBox from "@/components/layout/LayoutBox";
import CheckBox from "@/components/ui/CheckBox";
import Link from "next/link";
import CartLayout from "@/components/cart/CartLayout";
import NoItem from "@/components/ui/NoItem";
import { updateCart } from "@/lib/utils";
import { toast } from "react-toastify";
import Meta from "@/components/layout/Meta";

enum Operation {
  increase = 1,
  decrease = -1,
}

interface CartProduct extends Product {
  image: string;
}

export default function Cart() {
  const [update, setUpdate] = useState(false);
  const updatePerSecond = 10;

  const [products, setProducts] = useState<CartProduct[]>([]);
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
    toast.success("Product deleted");
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
        <LayoutTitle className={styles.layoutTitle}>
          <Meta title="Cart" />
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
                      src={"/images/products/" + product.image}
                      alt={product.image}
                      width="0"
                      height="0"
                      sizes="6rem"
                    />
                    <Link href={"/product/" + product.url}>
                      {product.title}
                    </Link>
                  </div>
                  <div className={styles.longRow}>
                    <Link href={"/product/" + product.url}>
                      {product.title}
                    </Link>
                    <div className={styles.shortRow}>
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
                        {(
                          product.list_price * product.cart?.quantity!
                        ).toLocaleString("tr-TR") + " TL"}
                      </h4>
                    </div>
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
