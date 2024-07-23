import { FC } from "react";
import styles from "./LayoutContainer.module.css";

interface Props {
  children?: React.ReactNode;
}

const LayoutContainer: FC<Props> = ({ children }) => {
  return <div className={styles.column}>{children}</div>;
};

export default LayoutContainer;
