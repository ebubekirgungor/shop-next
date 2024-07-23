import { FC } from "react";
import styles from "./LayoutTitle.module.css";

interface Props {
  children?: React.ReactNode;
}

const LayoutTitle: FC<Props> = ({ children }) => {
  return <div className={styles.box}>{children}</div>;
};

export default LayoutTitle;
