import styles from "./layout.module.css";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="categories">
          <Icon name="category"></Icon>
          Categories
        </Link>
      </nav>
      {children}
    </>
  );
}
