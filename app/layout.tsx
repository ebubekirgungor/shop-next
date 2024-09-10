import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import ToastProvider from "./ToastProvider";
import Navbar from "@/components/navbar/Navbar";
import meta from "@/config/meta.json";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${meta.title}`,
    default: meta.title,
  },
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ToastProvider className={`${poppins.className} ${styles.toast}`}>
          <Navbar />
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            {new Date().getFullYear()} ebubekirgungor - No rights reserved
            <Link href="https://github.com/ebubekirgungor/shop-next">
              Source code
            </Link>
          </footer>
          {auth}
        </ToastProvider>
      </body>
    </html>
  );
}
