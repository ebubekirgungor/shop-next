import { FC } from "react";
import styles from "./Icon.module.css";

interface Props {
  name: string;
  disableFilter?: boolean;
}

const Icon: FC<Props> = ({ name, disableFilter }) => {
  return (
    <div
      className={styles.icon}
      style={{
        backgroundImage: `url("/icons/${name}.svg")`,
        filter: disableFilter ? "none" : undefined,
      }}
    ></div>
  );
};

export default Icon;
