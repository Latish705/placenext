import React from 'react';
import styles from '../../../app/student/styles_a/Home.module.css';

const CompanyCard = ({ logoSrc, name }) => {
  return (
    <div className={styles.companyCard}>
      <img src={logoSrc} alt={name} className={styles.companyLogo} />
      <p>{name}</p>
    </div>
  );
};

export default CompanyCard;
