import React from 'react';
import styles from './events.module.css';

const PaginationSkeleton: React.FC = () => {
  return (
    <div className={styles.pagination}>
      <div className={styles.actions}>
        <div className={styles.skeletonButton}></div>
      </div>
      <div className={styles.pages}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={styles.skeletonPage}></div>
        ))}
      </div>
      <div className={styles.itemsPerPage}>
        <div className={styles.skeletonSelect}></div>
      </div>
    </div>
  );
};

export default PaginationSkeleton;
