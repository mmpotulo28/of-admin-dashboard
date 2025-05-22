import React from 'react';
import styles from '../users.module.css';

const SkeletonLoader: React.FC = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonHeader}></div>
      <div className={styles.skeletonInsights}>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
      </div>
      <div className={styles.skeletonCharts}>
        <div className={styles.skeletonChart}></div>
        <div className={styles.skeletonChart}></div>
      </div>
      <div className={styles.skeletonTable}></div>
    </div>
  );
};

export default SkeletonLoader;
