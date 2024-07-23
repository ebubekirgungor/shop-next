import { MouseEvent, FC } from "react";
import styles from "./Dialog.module.css";
import Icon from "../Icon";

interface Props {
  title: string;
  close: (e: MouseEvent<HTMLButtonElement>) => void;
  status: boolean;
  children?: React.ReactNode;
}

const Dialog: FC<Props> = ({ title, close, status, children }) => {
  return (
    <>
      <div className={`${styles.background} ${!status && styles.close}`} />
      <div className={styles.container}>
        <div className={`${styles.dialog} ${!status && styles.close}`}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeButton} onClick={close}>
            <Icon name="close" />
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default Dialog;
