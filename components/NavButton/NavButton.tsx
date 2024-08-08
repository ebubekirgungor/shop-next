import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavButton.module.css";

interface Props {
  href: string;
  icon: string;
  children?: React.ReactNode;
}

const NavButton: FC<Props> = ({ href, icon, children }) => {
  return (
    <Link href={href} className={styles.link}>
      <Image
        src={`/icons/` + icon + `.svg`}
        alt="icon"
        width={24}
        height={24}
      />
      {children}
    </Link>
  );
};

export default NavButton;
