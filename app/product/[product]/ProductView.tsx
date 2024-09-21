"use client";
import { useState, useEffect, TouchEvent } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";

interface Comment {
  date: Date;
  content: string;
  author: User;
}

const dateOptions: Object = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

export default function ProductView({
  product,
  isLoggedIn,
}: {
  product: Product;
  isLoggedIn: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`/api/product/${product.id}/comments`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      });

    if (isLoggedIn) {
      fetch(`/api/product/${product.id}/is_favorite`)
        .then((response) => response.json())
        .then((data) => {
          setIsFavorite(data);
        });
    }
  }, [product.id]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) setLoading(false);
  }, [product]);

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

  async function addProductToCart() {
    const response = await jsonFetcher("/api/cart/" + product?.id, "POST");

    if (response.status === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  async function toggleFavorite() {
    const response = await jsonFetcher(
      "/api/favorites/" + product?.id,
      isFavorite ? "DELETE" : "POST"
    );

    if (response.status === 200) {
      setIsFavorite(!isFavorite);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  async function addComment() {
    const response = await jsonFetcher(
      `/api/product/${product.id}/comments`,
      "POST",
      { content: newComment }
    );

    if (response.status === 200) {
      toast.success(response.message);
      setComments((prev) => [...prev, response.body]);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <main className={styles.box}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className={styles.productContainer}>
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
                <>
                  <button
                    style={{ left: "1rem" }}
                    className={styles.slideButton}
                    type="button"
                    onClick={() => gotoSlide(slideIndex - 1)}
                  >
                    <Icon name="previous" />
                  </button>
                  <button
                    style={{ left: "calc(100% - (40px + 1rem))" }}
                    className={styles.slideButton}
                    type="button"
                    onClick={() => gotoSlide(slideIndex + 1)}
                  >
                    <Icon name="next" />
                  </button>
                </>
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
              <div className={styles.title}>
                {product?.title}
                {isLoggedIn && (
                  <button
                    className={styles.favoriteButton}
                    onClick={toggleFavorite}
                  >
                    {isFavorite ? (
                      <Icon name="favorite_filled" disableFilter />
                    ) : (
                      <Icon name="favorite" />
                    )}
                  </button>
                )}
              </div>
              <div className={styles.priceAndButton}>
                <div className={styles.listPrice}>
                  {product?.list_price.toLocaleString("tr-TR")} TL
                </div>
                <Button onClick={addProductToCart}>Add to Cart</Button>
              </div>
            </div>
          </section>
          <section className={styles.commentsContainer}>
            <div className={styles.comment}>
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={addComment}>Create</Button>
            </div>
            {comments.map((comment, index) => (
              <div className={styles.comment} key={index}>
                <div className={styles.spaceBetween}>
                  <span>{comment.content}</span>
                  <span>
                    {new Date(comment.date).toLocaleString(
                      "tr-TR",
                      dateOptions
                    )}
                  </span>
                </div>
                <div className={styles.author}>
                  {comment.author.first_name} {comment.author.last_name}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
