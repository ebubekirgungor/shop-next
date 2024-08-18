import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import NavButton from "@/components/NavButton";
import NavAccount from "./NavAccount";
import StoreProvider from "./StoreProvider";
import ToastProvider from "./ToastProvider";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={poppins.className}>
          <ToastProvider className={poppins.className}>
            <nav className={styles.nav}>
              <Link className={styles.logo} href="/">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={200}
                  height={100}
                  priority
                />
              </Link>
              <div className={styles.search}>
                <input placeholder="Search products" />
              </div>
              <div className={styles.nav_buttons}>
                <NavAccount />
                <NavButton icon="favorite" href="/account/favorites">
                  Favorites
                </NavButton>
                <NavButton icon="cart" href="/cart">
                  Cart
                </NavButton>
              </div>
            </nav>
            <main className={styles.main}>{children}</main>
          </ToastProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
