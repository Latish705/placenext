import React from 'react';
import styles from '../../../app/student/styles_a/Home.module.css';

const Section1Intro = () => {
  return (
    <section id="intro" className={styles.sectionIntro}>
      <div className={styles.overlay}>
        <h2 className={styles.redText}>PlaceNext</h2>
        {/* <p>PlaceNext is a platform to streamline and showcase placement activities and success stories of our students.</p> */}
      </div>
    </section>
  );
};

export default Section1Intro;
