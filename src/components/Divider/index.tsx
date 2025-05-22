import { iTheme } from '@/lib/types';
import styles from './divider.module.css';

export interface iDivider {
  theme?: iTheme;
  padded?: boolean;
}

const Divider: React.FC<iDivider> = ({
  theme = iTheme.Light,
  padded = true,
}) => {
  const classNames = [
    styles.divider,
    styles[theme],
    padded ? styles.padded : '',
  ].join(' ');

  return <div className={classNames} />;
};

export default Divider;
