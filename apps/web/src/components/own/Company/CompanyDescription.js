import React from 'react';
import styles from '../../../app/student/styles_a/Home.module.css';

const CompanyDescription = ({ logoSrc, name, details, description }) => {
  return (
    <div className={styles.companyDescriptionCard}>
      <div className={styles.companyHeader}>
        <img src={logoSrc} alt={name} className={styles.companyLogo} />
        <div>
          <h3 className={styles.companyName}>{name}</h3>
          <ul className={styles.companyDetails}>
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className={styles.companyDescription}>{description}</p>
    </div>
  );
};

export default CompanyDescription;
