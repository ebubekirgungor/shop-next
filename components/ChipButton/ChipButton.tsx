import { FC } from "react";
import styles from "./ChipButton.module.css";

interface Props {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

const ChipButton: FC<Props> = ({ onClick, children }) => {
  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default ChipButton;
