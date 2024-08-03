import { FC } from "react";
import styles from "./LayoutTitle.module.css";

interface Props {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const LayoutTitle: FC<Props> = ({ style, children }) => {
  return (
    <div className={styles.box} style={style}>
      {children}
    </div>
  );
};

export default LayoutTitle;
