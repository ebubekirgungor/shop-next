"use client";
import { useState, useEffect, TouchEvent } from "react";
import styles from "./page.module.css";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

interface Product {
  id: number | null;
  title: string;
  url: string;
  category: string;
  list_price: number;
  stock_quantity: number;
  images: string[];
}

export default function Product({ params }: { params: { url: string } }) {
  const [product, setProduct] = useState<Product>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/product/" + params.url)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, []);

  const [startX, setStartX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  function gotoSlide(index: number) {
    if (index < 0) {
      setSlideIndex(product!.images.length - 1);
    } else if (index >= product!.images.length) {
      setSlideIndex(0);
    } else {
      setSlideIndex(index);
    }
  }

  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    setDragging(true);
    setStartX(e.touches[0].clientX);
  }

  function onTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!dragging) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    if (Math.abs(diffX) > 50) {
      gotoSlide(slideIndex + (diffX > 0 ? -1 : 1));
      setDragging(false);
    }
  }

  return (
    <div className={styles.box}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.sliderContainer}>
            <div
              className={styles.slider}
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
            >
              {product?.images.map((image, index) => (
                <div key={index} style={{ flex: "0 0 100%" }}>
                  <Image
                    src={"/images/products/" + image}
                    alt={image}
                    width="0"
                    height="0"
                    sizes="35rem"
                  />
                </div>
              ))}
            </div>
            {product!.images!.length > 1 && (
              <div className={styles.slideButtons}>
                <button type="button" onClick={() => gotoSlide(slideIndex - 1)}>
                  <Icon name="previous" />
                </button>
                <button type="button" onClick={() => gotoSlide(slideIndex + 1)}>
                  <Icon name="next" />
                </button>
              </div>
            )}
            <div className={styles.miniImages}>
              {product?.images.map((image, index) => (
                <button
                  className={slideIndex === index ? styles.selected : ""}
                  key={index}
                  type="button"
                  onClick={() => gotoSlide(index)}
                >
                  <Image
                    src={"/images/products/" + image}
                    alt={image}
                    width="0"
                    height="0"
                    sizes="3rem"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className={styles.product}>
            <div className={styles.title}>{product?.title}</div>
            <div className={styles.listPrice}>{product?.list_price} TL</div>
            <Button>Add to Cart</Button>
          </div>
        </>
      )}
    </div>
  );
}
