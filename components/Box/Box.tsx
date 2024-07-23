import { FC } from "react";
import styles from "./Box.module.css";

interface Props {
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

const Box: FC<Props> = ({ width, height, children }) => {
  return (
    <div className={styles.box} style={{ width, height }}>
      {children}
    </div>
  );
};

export default Box;
