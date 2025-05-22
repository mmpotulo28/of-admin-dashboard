import React from 'react';
import ControlsSkeleton from './ControlsSkeleton';
import EventListSkeleton from './EventListSkeleton';
import PaginationSkeleton from './PaginationSkeleton';
import styles from './events.module.css';

const Skeleton: React.FC = () => {
  return (
    <div className={styles.events}>
      <ControlsSkeleton />
      <EventListSkeleton />
      <PaginationSkeleton />
    </div>
  );
};

export default Skeleton;
