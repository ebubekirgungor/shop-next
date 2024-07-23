import { MouseEvent, FC } from "react";
import styles from "./Address.module.css";
import Icon from "../Icon";

interface Props {
  title: string;
  customerName: string;
  address: string;
  editButton: (e: MouseEvent<HTMLButtonElement>) => void;
  deleteButton: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Address: FC<Props> = ({
  title,
  address,
  customerName,
  editButton,
  deleteButton,
}) => {
  return (
    <div className={styles.box}>
      <div className={styles.title}>
        <div style={{ width: "6rem" }}>{title}</div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={editButton}>
            <Icon name="edit" />
          </button>
          <button className={styles.button} onClick={deleteButton}>
            <Icon name="delete" />
          </button>
        </div>
      </div>
      <div className={styles.customerName}>{customerName}</div>
      <div className={styles.address}>{address}</div>
    </div>
  );
};

export default Address;
