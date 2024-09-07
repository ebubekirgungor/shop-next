import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import NavButton from "@/components/navbar/NavButton";
import ToastProvider from "./ToastProvider";
import NavSearch from "@/components/navbar/NavSearch";
import Box from "@/components/ui/Box";
import Icon from "@/components/ui/Icon";
import { Role } from "@/lib/types";
import { cookies } from "next/headers";
import LogoutButton from "@/components/navbar/LogoutButton";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = cookies().get("role")?.value;
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ToastProvider className={`${poppins.className} ${styles.toast}`}>
          <nav className={styles.nav}>
            <div className={styles.logo}>
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={200}
                  height={100}
                  priority
                />
              </Link>
            </div>
            <input id="search" type="checkbox" style={{ display: "none" }} />
            <NavSearch />
            <div className={styles.navButtons}>
              <button type="button">
                <label className={styles.searchButton} htmlFor="search">
                  <Icon name="search_mobile" />
                </label>
              </button>
              {role ? (
                <div className={styles.accountBoxContainer}>
                  <NavButton icon="account" href={"/account/personal-details"}>
                    Account
                    <Icon name="expand_more" />
                  </NavButton>
                  <Box className={styles.accountBox} width="9rem" height="auto">
                    <div className={styles.spacing} />
                    {role && role === Role.ADMIN && (
                      <NavButton icon="admin" href={"/admin/categories"}>
                        Admin
                      </NavButton>
                    )}
                    <LogoutButton />
                  </Box>
                </div>
              ) : (
                <NavButton icon="account" href={"/login"}>
                  Login
                </NavButton>
              )}
              <NavButton icon="favorite" href="/account/favorites">
                Favorites
              </NavButton>
              <NavButton icon="cart" href="/cart">
                Cart
              </NavButton>
            </div>
          </nav>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            {new Date().getFullYear()} ebubekirgungor - No rights reserved
            <Link href="https://github.com/ebubekirgungor/shop-next">
              Source code
            </Link>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
