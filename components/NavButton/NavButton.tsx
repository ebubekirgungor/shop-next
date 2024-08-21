import { FC } from "react";
import Link from "next/link";
import styles from "./NavButton.module.css";
import Icon from "../Icon";

interface Props {
  href: string;
  icon: string;
  children?: React.ReactNode;
}

const NavButton: FC<Props> = ({ href, icon, children }) => {
  return (
    <Link href={href} className={styles.link}>
      <Icon name={icon} />
      <span>{children}</span>
    </Link>
  );
};

export default NavButton;
