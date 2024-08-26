"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    categories.map((category) => (
      <Link href={category.url} className={styles.category} key={category.id}>
        <Image
          src={category.image!}
          alt={category.image!}
          width="0"
          height="0"
          sizes="18rem"
        />
      </Link>
    ))
  );
}
