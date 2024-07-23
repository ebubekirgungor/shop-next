import { FC } from "react";
import styles from "./LayoutBox.module.css";

interface Props {
  children?: React.ReactNode;
  minHeight?: string;
}

const LayoutBox: FC<Props> = ({ children, minHeight }) => {
  return (
    <div className={styles.box} style={{ minHeight }}>
      {children}
    </div>
  );
};

export default LayoutBox;
