import { FC } from "react";
import styles from "./Icon.module.css";

interface Props {
  name: string;
}

const Icon: FC<Props> = ({ name }) => {
  return (
    <div
      className={styles.icon}
      style={{ backgroundImage: `url("/icons/${name}.svg")` }}
    ></div>
  );
};

export default Icon;
