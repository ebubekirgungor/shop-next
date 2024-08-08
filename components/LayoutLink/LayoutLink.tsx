"use client";

import { FC } from "react";
import styles from "./LayoutLink.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "../Icon";

interface Props {
  href: string;
  icon: string;
  title: string;
}

const LayoutLink: FC<Props> = ({ href, icon, title }) => {
  console.log(usePathname());
  return (
    <Link
      className={`${styles.link} ${
        usePathname() === href ? styles.active : ""
      }`}
      href={href}
    >
      <Icon name={icon} />
      {title}
    </Link>
  );
};

export default LayoutLink;
