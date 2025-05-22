'use client';
import React from 'react';
import styles from './lockup.module.css';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { iLockUpProps, iTheme } from '@/lib/types';

const LockUp: React.FC<iLockUpProps> = ({
  id,
  overline,
  title = 'LockUp Title',
  subtitle,
  variant = 'primary',
  size = 'md',
  theme = iTheme.Light,
  centered = false,
  bold = false,
}) => {
  const { elementRef, isVisible } = useIntersectionObserver();

  const truncate = (text?: string) => {
    if (!text) return '';
    return text.length > 256 ? `${text.substring(0, 253)}...` : text;
  };

  const classNames = [
    styles.lockup,
    styles[variant],
    styles[size],
    styles[theme],
    centered ? styles.centered : '',
    bold ? styles.bold : '',
    isVisible ? 'slideIn' : '',
  ].join(' ');

  return (
    <div id={id} className={classNames} ref={elementRef}>
      {overline && <span>{truncate(overline)}</span>}
      <h1>{truncate(title)}</h1>
      {subtitle && <p>{truncate(subtitle)}</p>}
    </div>
  );
};

export default LockUp;
