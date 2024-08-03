import { FC } from "react";
import styles from "./Chip.module.css";

interface Props {
  children?: React.ReactNode;
}

const Chip: FC<Props> = ({ children }) => {
  return (
    <div className={styles.chip}>
      {children}
    </div>
  );
};

export default Chip;
