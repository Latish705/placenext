import React from 'react';
import styles from '../../../app/student/styles_a/Home.module.css';

const Section2Results = () => {
  return (
    <section id="results" className={styles.sectionResults}>
      <h2>Placement Results</h2>
      <p>Our students have been placed in top companies. Check out our recent placement statistics!</p>
      <div className={styles.barChart}>
        <div className={styles.barWrapper}>
          <span>2024</span>
          <div className={styles.bar} style={{ width: '85%' }}>85%</div>
        </div>
        <div className={styles.barWrapper}>
          <span>2023</span>
          <div className={styles.bar} style={{ width: '80%' }}>80%</div>
        </div>
        <div className={styles.barWrapper}>
          <span>2022</span>
          <div className={styles.bar} style={{ width: '78%' }}>78%</div>
        </div>
      </div>
    </section>
  );
};

export default Section2Results;
