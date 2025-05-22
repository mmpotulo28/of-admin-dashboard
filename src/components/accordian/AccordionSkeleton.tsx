import React from 'react';
import styles from './accordion.module.css';
import { Skeleton } from '@/components/skeleton';

const AccordionSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className={styles.accordion}>
      {skeletonItems.map((_, index) => (
        <div key={index} className={styles['accordion-item']}>
          <div className={styles['accordion-item-header']}>
            <div className={styles.left}>
              <Skeleton />
            </div>
            <div className={styles.right}></div>
          </div>
          <div className={styles['accordion-item-content']}>
            <Skeleton />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionSkeleton;
