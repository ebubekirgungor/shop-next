import styles from "./layout.module.css";
import LayoutLink from "@/components/LayoutLink";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className={styles.nav}>
        <LayoutLink
          href="/admin/categories"
          icon="category"
          title="Categories"
        />
        <LayoutLink href="/admin/products" icon="product" title="Products" />
        <LayoutLink href="/admin/users" icon="account" title="Users" />
      </nav>
      {children}
    </>
  );
}
