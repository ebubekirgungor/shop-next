import styles from "./layout.module.css";
import LayoutLink from "@/components/LayoutLink";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className={styles.nav}>
        <LayoutLink
          href="/account/personal-details"
          icon="account"
          title="Personal Details"
        />
        <LayoutLink href="/account/orders" icon="order" title="Orders" />
        <LayoutLink
          href="/account/addresses"
          icon="address"
          title="Addresses"
        />
        <LayoutLink
          href="/account/favorites"
          icon="favorite"
          title="Favorites"
        />
      </nav>
      {children}
    </>
  );
}
