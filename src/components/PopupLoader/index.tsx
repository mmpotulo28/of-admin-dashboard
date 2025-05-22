import React, { JSX } from 'react';
import styles from './loader.module.css';

export enum iLoaderVariant {
  Circle = 'circle',
  Dot = 'dot',
}

interface PopupLoaderProps {
  variant?: iLoaderVariant;
}

/**
 * PopupLoader is a React functional component that displays a loading indicator.
 *
 * @param {object} props - The properties object.
 * @param {string} props.variant - The variant of the loader to be displayed.
 * @returns {JSX.Element} A JSX element representing the loading indicator.
 */
const PopupLoader: React.FC<PopupLoaderProps> = ({
  variant = iLoaderVariant.Dot,
}: PopupLoaderProps): JSX.Element => {
  return (
    <div className={`${styles.loaderContainer} ${styles[variant]}`}>
      <div className={styles.outline}>
        <section className={styles.loader}>
          <div className={styles.dot} />
        </section>
      </div>
    </div>
  );
};

export default PopupLoader;
