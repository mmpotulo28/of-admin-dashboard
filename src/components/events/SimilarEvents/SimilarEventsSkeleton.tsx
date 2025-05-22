import React from 'react';
import styles from './similar-events.module.css';
import EventHighlightSkeleton from '@/components/TopBanner/components/EventHighlightSkeleton';

const SimilarEventsSkeleton: React.FC = () => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <EventHighlightSkeleton key={index} size="sm" />
      ))}
    </div>
  );
};

export default SimilarEventsSkeleton;
