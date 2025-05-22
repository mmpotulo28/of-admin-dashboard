import React from 'react';
import styles from './events.module.css';

const ControlsSkeleton: React.FC = () => {
  return (
    <div className={styles.controls}>
      <div className={styles.tabsContainer}>
        <span className={styles.left}></span>
        <div className={styles.tabs}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.skeletonButton}></div>
          ))}
        </div>
        <span className={styles.right}></span>
      </div>
      <div className={styles.rightControls}>
        <div className={styles.skeletonSelect}></div>
        <div className={styles.skeletonSearch}></div>
      </div>
    </div>
  );
};

export default ControlsSkeleton;
