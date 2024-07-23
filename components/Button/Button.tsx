import { FC } from "react";
import styles from "./Button.module.css";

interface Props {
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: FC<Props> = ({ disabled, children }) => {
  return (
    <button className={styles.button} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
