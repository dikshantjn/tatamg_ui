import React from 'react';
import styles from './Logo.module.css';

const Logo = ({ size = 'regular', onClick }) => {
  return (
    <div className={styles.logoContainer} onClick={onClick}>
      <div className={styles.logoIcon} />
      <div className={`${styles.logoText} ${styles[size]}`}>
        <span className={styles.slogan}>Your Partner in Better Living</span>
        <div className={styles.mainLogo}>
          <span className={styles.vedikaText}>Vedika</span>
          <span className={styles.dotHealth}>
            <span className={styles.dot} />
            Health
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo; 