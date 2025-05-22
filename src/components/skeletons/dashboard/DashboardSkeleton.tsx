import styles from './dash-skeletons.module.css';

const DashboardSkeleton: React.FC = () => {
  return (
    <section className={styles.userDashLayout}>
      <aside className={styles.sidebar}>
        <nav>
          <div className={styles.top}>
            <div className={styles.skeletonLink}></div>
            <div className={styles.skeletonLink}></div>
            <div className={styles.skeletonLink}></div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.skeletonLink}></div>
            <div className={styles.skeletonLink}></div>
          </div>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <div className={styles.skeletonHeader}></div>
        <div className={styles.skeletonContent}></div>
        <div className={styles.skeletonContent}></div>
        <div className={styles.skeletonContent}></div>
      </main>
    </section>
  );
};

export default DashboardSkeleton;
