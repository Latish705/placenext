import React from 'react';
import styles from '../../../app/student/styles_a/Home.module.css';

const Section3Companies = () => {
  return (
    <section id="companies" className={styles.sectionCompanies}>
      <h2>Companies Visiting Us</h2>
      <div className={styles.companiesGrid}>
        <div className={styles.companyCard}>
          <img src="../../" alt="Morgan Stanley" className={styles.companyLogo} />
          <p>Morgan Stanley</p>
        </div>
        <div className={styles.companyCard}>
          <img src="/images/jpmorgan.png" alt="J.P. Morgan & Chase" className={styles.companyLogo} />
          <p>J.P. Morgan & Chase</p>
        </div>
        <div className={styles.companyCard}>
          <img src="/images/nomura.png" alt="Nomura" className={styles.companyLogo} />
          <p>Nomura</p>
        </div>
        <div className={styles.companyCard}>
          <img src="/images/generalmills.png" alt="General Mills" className={styles.companyLogo} />
          <p>General Mills</p>
        </div>
        <div className={styles.companyCard}>
          <img src="/images/accenture.png" alt="Accenture" className={styles.companyLogo} />
          <p>Accenture</p>
        </div>
        <div className={styles.companyCard}>
          <img src="/images/capgemini.png" alt="Capgemini" className={styles.companyLogo} />
          <p>Capgemini</p>
        </div>
        <div className={styles.companyCard}>
          <img src="/images/ltinfo.png" alt="L&T Info" className={styles.companyLogo} />
          <p>L&T Info</p>
        </div>
        <div className={styles.companyCard}>
          <img src="/images/maqsoftware.png" alt="MAQ Software" className={styles.companyLogo} />
          <p>MAQ Software</p>
        </div>
      </div>
    </section>
  );
};

export default Section3Companies;
