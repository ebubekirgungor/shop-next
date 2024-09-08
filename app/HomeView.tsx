"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function HomePage({ categories }: { categories: Category[] }) {
  return categories.map((category) => (
    <Link href={category.url} className={styles.category} key={category.id}>
      <Image
        src={category.image!}
        alt={category.image!}
        width="0"
        height="0"
        sizes="18rem"
      />
    </Link>
  ));
}
