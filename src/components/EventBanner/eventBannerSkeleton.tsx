import styles from './eventBanner.module.css';

/**
 * A skeleton loader component for the Event Banner.
 * Displays placeholder elements while the actual content is loading.
 */
const EventBannerSkeleton: React.FC = () => (
  <div className={`${styles.eventBanner} ${styles.skeleton}`}>
    <div className={styles.gradientUp}>
      <div className={styles.details}>
        <div className={styles.detailsLeft}>
          <div className={`${styles.skeletonBlock} ${styles.title}`} />
          <div className={`${styles.skeletonBlock} ${styles.subtitle}`} />
          <div className={`${styles.skeletonBlock} ${styles.actions}`} />
        </div>
        <div className={styles.detailsRight}>
          <div className={`${styles.skeletonBlock} ${styles.info}`} />
          <div className={`${styles.skeletonBlock} ${styles.info}`} />
          <div className={`${styles.skeletonBlock} ${styles.info}`} />
          <div className={`${styles.skeletonBlock} ${styles.info}`} />
        </div>
      </div>
    </div>
  </div>
);

export default EventBannerSkeleton;
