import { FC } from "react";
import styles from "./LayoutBox.module.css";

interface Props {
  minHeight?: string;
  className?: string;
  children?: React.ReactNode;
}

const LayoutBox: FC<Props> = ({ minHeight, className, children }) => {
  return (
    <div className={`${styles.box} ${className}`} style={{ minHeight }}>
      {children}
    </div>
  );
};

export default LayoutBox;
