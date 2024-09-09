import React from 'react';
import styles from '../../../app/student/styles_a/Home.module.css';

const ReviewCard = ({ photo, name, message }) => {
  return (
    <div className={styles.reviewCard}>
      <img src={photo} alt={name} className={styles.reviewPhoto} />
      <h3 className={styles.reviewName}>{name}</h3>
      <p className={styles.reviewMessage}>{message}</p>
    </div>
  );
};

export default ReviewCard;
