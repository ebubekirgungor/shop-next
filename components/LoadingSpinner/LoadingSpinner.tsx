import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader} />
    </div>
  );
};

export default LoadingSpinner;
