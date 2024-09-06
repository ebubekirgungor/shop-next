import { ChangeEvent, FC, InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<Props> = ({ label, name, value, onChange, ...rest }) => {
  return (
    <label style={{ width: "100%" }}>
      {label}
      <input
        className={styles.input}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
};

export default Input;
