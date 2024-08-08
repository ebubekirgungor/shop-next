import styles from "./layout.module.css";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="personal-details">
          <Icon name="account" />
          Personal Details
        </Link>
        <Link href="addresses">
          <Icon name="address" />
          Addresses
        </Link>
        <Link href="favorites">
          <Icon name="favorite" />
          Favorites
        </Link>
      </nav>
      {children}
    </>
  );
}
