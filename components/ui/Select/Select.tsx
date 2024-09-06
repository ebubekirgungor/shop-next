import { ChangeEvent, FC, SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  type?: string;
  name?: string;
  value?: string | number;
  children?: React.ReactNode;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<Props> = ({ label, value, children, onChange, ...rest }) => {
  return (
    <label style={{ width: "100%" }}>
      {label}
      <select
        value={value}
        onChange={onChange}
        style={{ marginTop: "0.5rem" }}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
};

export default Select;
