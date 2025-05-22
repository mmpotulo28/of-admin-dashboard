import styles from './dash-skeletons.module.css';

const MainSkeleton: React.FC = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.skeletonContent}></div>
      <div className={styles.skeletonContent}></div>
      <div className={styles.skeletonContent}></div>
    </div>
  );
};

export default MainSkeleton;
