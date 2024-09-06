import { FC } from "react";
import styles from "./NoItem.module.css";

interface Props {
  icon: string;
  description: string;
}

const NoItem: FC<Props> = ({ icon, description }) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.noItem}
        style={{
          backgroundImage: `url("/icons/${icon}.svg")`,
        }}
      />
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default NoItem;
