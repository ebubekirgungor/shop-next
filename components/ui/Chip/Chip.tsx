import { FC } from "react";
import styles from "./Chip.module.css";

interface Props {
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

const Chip: FC<Props> = ({ selected, onClick, children }) => {
  return (
    <div
      className={`${styles.chip} ${selected && styles.selected}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Chip;
