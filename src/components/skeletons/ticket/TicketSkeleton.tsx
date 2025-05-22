import React from 'react';
import styles from '@/components/EventTicket/event-ticket.module.css';

const TicketSkeleton: React.FC = () => (
  <div className={`${styles.shadow} ${styles.skeleton}`}>
    <div className={styles.ticketContainer}>
      <div className={styles.left}>
        <div className={`${styles.image} ${styles.skeletonBlock}`} />
      </div>
      <div className={styles.ticketInfo}>
        <div className={`${styles.skeletonBlock} ${styles.date}`} />
        <div className={`${styles.skeletonBlock} ${styles.showName}`} />
        <div className={`${styles.skeletonBlock} ${styles.time}`} />
        <div className={`${styles.skeletonBlock} ${styles.location}`} />
      </div>
      <div className={styles.right}>
        <div className={`${styles.skeletonBlock} ${styles.qrCode}`} />
        <div className={`${styles.skeletonBlock} ${styles.ticketNumber}`} />
      </div>
    </div>
  </div>
);

export default TicketSkeleton;
