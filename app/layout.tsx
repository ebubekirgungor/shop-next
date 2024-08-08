import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import NavButton from "@/components/NavButton";
import { cookies } from "next/headers";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = cookies().get("role");

  return (
    <html lang="en">
      <body className={poppins.className}>
        <header className={styles.nav}>
          <div className={styles.logo}>
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={100}
                priority={true}
              />
            </Link>
          </div>
          <div className={styles.search}>
            <input placeholder="Search products" />
          </div>
          <div className={styles.nav_buttons}>
            <NavButton
              icon="account"
              href={role ? "/account/personal-details" : "/login"}
            >
              {role ? "Account" : "Login"}
            </NavButton>
            <NavButton icon="favorite" href="/account/favorites">
              Favorites
            </NavButton>
            <NavButton icon="cart" href="/cart">
              Cart
            </NavButton>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
