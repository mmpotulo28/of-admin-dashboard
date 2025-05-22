import styles from "./topBanner.module.css";

interface GradientUpProps {
  children: React.ReactNode;
}

const GradientUp: React.FC<GradientUpProps> = ({ children }) => {
  return <div className={styles.gradientUp}>{children}</div>;
};

export default GradientUp;
