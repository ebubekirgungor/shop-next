import { ChangeEvent, FC } from "react";
import styles from "./CheckBox.module.css";

interface Props {
  label?: string;
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox: FC<Props> = ({ label, id, name, checked, onChange }) => {
  return (
    <div className={styles.div}>
      <div className={styles.input}>
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
        </svg>
      </div>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default CheckBox;
