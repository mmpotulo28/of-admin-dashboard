'use client';
import React, { ReactElement } from 'react';
import styles from '../contentCards.module.css';
import { FaArrowRight } from 'react-icons/fa';
import Button, { iButtonProps } from '@/components/Common/button';
import { iVariant } from '@/lib/types';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

export interface iContentCardProps {
  icon?: ReactElement;
  title: string;
  description: string;
  centered?: boolean;
  padded?: boolean;
  highlighted?: boolean;
  button?: iButtonProps;
}

const ContentCard: React.FC<iContentCardProps> = ({
  icon,
  title,
  description,
  padded = true,
  centered = true,
  highlighted,
  button,
}) => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const classNames = [
    styles.card,
    padded ? styles.padded : '',
    centered ? styles.centered : '',
    highlighted ? styles.highlighted : '',
    isVisible && 'slideInRight',
  ].join(' ');

  return (
    <div className={classNames} ref={elementRef}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      {button && (
        <Button
          variant={iVariant.Tertiary}
          label={button?.label}
          iconEnd={<FaArrowRight />}
          type={button.type}
          url={button.url}
        />
      )}
    </div>
  );
};

export default ContentCard;
