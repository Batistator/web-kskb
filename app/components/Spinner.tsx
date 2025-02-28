import styles from '../styles/Spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.loader}>
      <span></span>
    </div>
  );
};

export default Spinner;