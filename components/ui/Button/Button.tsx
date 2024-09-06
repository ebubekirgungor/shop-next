import { ButtonHTMLAttributes, FC } from "react";
import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  type?: ButtonHTMLAttributes<string>["type"];
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

const Button: FC<Props> = ({
  disabled,
  type,
  className,
  onClick,
  children,
}) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
