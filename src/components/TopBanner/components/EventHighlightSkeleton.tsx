import React from 'react';
import styles from './hightlight.module.css';

const EventHighlightSkeleton: React.FC<{ size?: string }> = ({
  size = 'sm',
}) => {
  return (
    <div className={`${styles.highlight} ${styles.skeleton} ${styles[size]}`}>
      <div className={styles.overlay}>
        <div className={styles.skeletonLockUp}></div>
        <div className={styles.skeletonDetails}></div>
        <div className={styles.skeletonBottom}></div>
      </div>
    </div>
  );
};

export default EventHighlightSkeleton;
