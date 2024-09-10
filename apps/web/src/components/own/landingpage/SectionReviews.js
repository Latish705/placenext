import React from 'react';
import ReviewCard from './ReviewCard';
import styles from '../../../app/student/styles_a/Home.module.css';

const reviews = [
  {
    photo: '/images/SectionReview/assets2.png',
    name: 'John Doe',
    message: 'PlaceNext helped me land my dream job. The platform is amazing!'
  },
  {
    photo: '/images/SectionReview/assets2.png',
    name: 'Jane Smith',
    message: 'A seamless experience for placement. Highly recommended for students.'
  },
  {
    photo: '/images/SectionReview/assets2.png',
    name: 'Mike Johnson',
    message: 'PlaceNext streamlined the whole placement process for me!'
  }
];

const SectionReviews = () => {
  return (
    <section id="reviews" className={styles.sectionReviews}>
      <h2 className={styles.sectionReviewsmaintext}>Student Reviews</h2>
      <div className={styles.reviewsGrid}>
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            photo={review.photo}
            name={review.name}
            message={review.message}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionReviews;
