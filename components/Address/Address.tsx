import { MouseEvent, FC } from "react";
import styles from "./Address.module.css";
import Icon from "../Icon";

interface Props {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  title: string;
  customerName: string;
  address: string;
  editButton?: (e: MouseEvent<HTMLButtonElement>) => void;
  deleteButton?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Address: FC<Props> = ({
  className,
  onClick,
  title,
  address,
  customerName,
  editButton,
  deleteButton,
}) => {
  return (
    <div className={`${styles.box} ${className}`} onClick={onClick}>
      <div className={styles.title}>
        <div style={{ width: "6rem" }}>{title}</div>
        {editButton && deleteButton && (
          <div className={styles.actions}>
            <button className={styles.button} onClick={editButton}>
              <Icon name="edit" />
            </button>
            <button className={styles.button} onClick={deleteButton}>
              <Icon name="delete" />
            </button>
          </div>
        )}
      </div>
      <div className={styles.customerName}>{customerName}</div>
      <div className={styles.address}>{address}</div>
    </div>
  );
};

export default Address;
