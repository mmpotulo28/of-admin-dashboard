import React from 'react';
import styles from './events.module.css';

const EventListSkeleton: React.FC = () => {
  return (
    <div className={styles.eventListContainer}>
      <div className={styles.selectedEvent}>
        <div className={styles.skeletonHighlight}></div>
      </div>
      <div className={styles.eventList}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.eventItem}>
            <div className={styles.eventItemImage}>
              <div className={styles.skeletonImage}></div>
            </div>
            <div className={styles.eventItemDetails}>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventListSkeleton;
