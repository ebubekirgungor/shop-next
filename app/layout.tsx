import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import NavButton from "@/components/NavButton";
import { cookies } from "next/headers";
import { Role } from "@/enums";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Shop",
};

const role = cookies().get("role");

//{role == Role.ADMIN ? "Account" : "Login"}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              ></Image>
            </Link>
          </div>
          <div className={styles.search}>
            <input placeholder="Search products"></input>
          </div>
          <div className={styles.nav_buttons}>
            <NavButton
              icon="account"
              href={role ? "/account/personal-details" : "/login"}
            >
              {role ? "Account" : "Login"}
            </NavButton>
            <NavButton icon="favorite" href="/favorites">
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
