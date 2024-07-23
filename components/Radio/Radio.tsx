import { ChangeEvent, FC, InputHTMLAttributes } from "react";
import styles from "./Radio.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  name?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Radio: FC<Props> = ({ label, name, value, onChange, ...rest }) => {
  return (
    <label className={styles.row}>
      <input
        className={styles.input}
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {label}
    </label>
  );
};

export default Radio;
