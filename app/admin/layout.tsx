import styles from "./layout.module.css";

import { MobileNavButtons } from "@/components/navbar";
import { LayoutLink } from "@/components/layout";
import { Icon } from "@/components/ui";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MobileNavButtons />
      <input id="nav" type="checkbox" style={{ display: "none" }} />
      <nav className={styles.nav}>
        <label className={styles.closeButton} htmlFor="nav">
          <Icon name="close" />
        </label>
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
