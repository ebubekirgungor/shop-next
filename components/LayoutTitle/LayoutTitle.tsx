import { FC } from "react";
import styles from "./LayoutTitle.module.css";

interface Props {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

const LayoutTitle: FC<Props> = ({ style, className, children }) => {
  return (
    <div className={`${styles.box} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default LayoutTitle;
