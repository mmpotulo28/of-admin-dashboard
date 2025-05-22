'use client';
import React, { JSX } from 'react';
import styles from './reviews.module.css';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme } from '@/lib/types';
import { MdVerified } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';

export interface iReview {
  content: string;
  author: {
    name: string;
    position: string;
    verified: boolean;
    source: JSX.Element;
  };
}

export interface iCustomerTestimonialsProps {
  title: string;
  subtitle: string;
  reviews: iReview[];
  theme?: iTheme;
}

const CustomerTestimonials: React.FC<iCustomerTestimonialsProps> = ({
  title,
  subtitle,
  reviews,
  theme = iTheme.Dark,
}) => {
  return (
    <div className={styles.customerTestimonials + ' ' + styles['Dark']}>
      <LockUp
        theme={theme}
        size={iSize.Large}
        title={title}
        subtitle={subtitle}
      />

      <div className={styles.testimonials}>
        {reviews?.map((review, index) => (
          <div key={index} className={styles.testimonial}>
            <div className={styles.reviews}>
              {[...Array(5)]?.map((_, i) => (
                <span className={styles.star} key={i}>
                  <FaStar />
                </span>
              ))}
            </div>
            <div className={styles.testimonialContent}>
              <p>&quot;{review.content}&quot;</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.details}>
                <h3>
                  {review.author.name}{' '}
                  {review.author.verified && (
                    <span>
                      <MdVerified />
                    </span>
                  )}
                </h3>
                <p>{review.author.position}</p>
              </div>
              <div className={styles.source}>{review.author.source}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
