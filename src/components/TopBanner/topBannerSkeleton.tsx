import styles from './topBanner.module.css';

/**
 * A skeleton loader component for the top banner.
 * Displays placeholder elements styled as a loading animation.
 */
const TopBannerSkeleton: React.FC = () => (
  <div className={`${styles.topBanner} ${styles.skeleton}`}>
    <div className={styles.gradientUp}>
      <div className={styles.bannerContent}>
        <div className={`${styles.skeletonBlock} ${styles.title}`} />
        <div className={`${styles.skeletonBlock} ${styles.content}`} />
        <div className={`${styles.skeletonBlock} ${styles.actions}`} />
      </div>
      <div className={styles.logo}>
        <div className={`${styles.skeletonBlock} ${styles.image}`} />
      </div>
    </div>
  </div>
);

export default TopBannerSkeleton;
