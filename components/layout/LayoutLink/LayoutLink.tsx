"use client";
import { FC } from "react";
import styles from "./LayoutLink.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Icon } from "@/components/ui";

interface Props {
  href: string;
  icon: string;
  title: string;
}

const LayoutLink: FC<Props> = ({ href, icon, title }) => {
  return (
    <Link
      className={`${styles.link} ${
        usePathname() === href ? styles.active : ""
      }`}
      href={href}
      onClick={() =>
        ((document.getElementById("nav") as HTMLInputElement).checked = false)
      }
    >
      <Icon name={icon} />
      {title}
    </Link>
  );
};

export default LayoutLink;
