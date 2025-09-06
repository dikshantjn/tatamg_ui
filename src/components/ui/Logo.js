import React from 'react';
import styles from './Logo.module.css';
import logoImg from '../../assets/logo/Logo.png';

const Logo = ({ size = 'regular', onClick }) => {
  const imageSize = size === 'large' ? 96 : size === 'small' ? 40 : 64;

  return (
    <div className={styles.logoContainer} onClick={onClick}>
      <img
        src={logoImg}
        alt="Vedika Health logo"
        className={styles.logoImage}
        style={{ width: imageSize, height: imageSize }}
      />
    </div>
  );
};

export default Logo; 