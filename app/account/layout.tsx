import Icon from "@/components/ui/Icon";
import styles from "./layout.module.css";
import LayoutLink from "@/components/layout/LayoutLink";
import MobileNavButtons from "@/components/navbar/MobileNavButtons";

export default function AccountLayout({
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
