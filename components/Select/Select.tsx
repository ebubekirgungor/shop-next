import { ChangeEvent, FC, SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  type?: string;
  name?: string;
  value?: string | number;
  children?: React.ReactNode;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<Props> = ({ label, value, onChange, children, ...rest }) => {
  return (
    <label style={{ width: "100%" }}>
      {label}
      <select
        className={styles.select}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
};

export default Select;
