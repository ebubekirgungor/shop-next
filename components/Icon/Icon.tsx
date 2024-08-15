import { FC } from "react";
import styles from "./Icon.module.css";
import Image from "next/image";

interface Props {
  name: string;
  disableFilter?: boolean;
}

const Icon: FC<Props> = ({ name, disableFilter }) => {
  return (
    <div className={styles.icon}>
      <Image
        priority
        src={`/icons/${name}.svg`}
        alt="icon"
        width="0"
        height="0"
        sizes="24px"
        style={{
          filter: disableFilter ? "none" : undefined,
        }}
      />
    </div>
  );
};

export default Icon;
