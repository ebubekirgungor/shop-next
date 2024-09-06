import { FC } from "react";
import styles from "./Box.module.css";

interface Props {
  width?: string;
  height?: string;
  className?: string;
  children?: React.ReactNode;
}

const Box: FC<Props> = ({ width, height, className, children }) => {
  return (
    <div className={`${styles.box} ${className}`} style={{ width, height }}>
      {children}
    </div>
  );
};

export default Box;
