'use client';
import React, { ReactElement, Suspense, useEffect, useState } from 'react';
import styles from './card.module.css';
import Image from 'next/image';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme, iVariant } from '@/lib/types';
import { iButtonProps } from '@/components/Common/button';
import Actions from '@/components/Common/Actions';
import { useGlobalContext } from '@/context/TopNavContext';

export enum iOrientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
}

export interface iCardProps {
  overline?: string;
  title: string;
  subtitle?: string;
  content?: string | ReactElement;
  image?: {
    src: string;
    alt: string;
  };
  actions?: iButtonProps[];
  orientation?: iOrientation;
  variant?: iVariant;
  size?: iSize;
  fullWidth?: boolean;
  flexible?: boolean;
  border?: boolean;
}

const Card: React.FC<iCardProps> = ({
  overline = '',
  title,
  subtitle = '',
  content,
  image,
  actions,
  orientation = iOrientation.Portrait,
  variant = iVariant.Primary,
  size = iSize.Small,
  fullWidth,
  flexible,
  border = true,
}) => {
  const [currentSize, setCurrentSize] = useState(size);
  const [currentOrientation, setCurrentOrientation] = useState(orientation);
  const { isMobile } = useGlobalContext();

  useEffect(() => {
    const handleResize = () => {
      if (isMobile) {
        setCurrentSize(iSize.Medium);
        setCurrentOrientation(iOrientation.Portrait);
      } else {
        setCurrentSize(size);
        setCurrentOrientation(orientation);
      }
    };

    handleResize();
  }, [isMobile, orientation, size]);

  return (
    <div
      className={`${styles.card} ${styles[variant]} ${
        styles[currentOrientation]
      } ${styles[currentSize]} ${flexible ? styles.flexible : ''} ${
        border ? styles.border : ''
      }`}
    >
      {image && (
        <div className={styles.cardHeader}>
          <Image src={image.src} alt={image.alt} height={250} width={250} />
          <span className={styles.imageAlt}>{image.alt}</span>
        </div>
      )}

      <div className={styles.cardContent}>
        <div className={styles.content}>
          <LockUp
            theme={variant !== iVariant.Tertiary ? iTheme.Dark : iTheme.Light}
            overline={overline}
            title={title}
            subtitle={subtitle}
            size={size}
          />
          {content && (
            <p>
              {typeof content === 'string'
                ? content.split('\n')?.map((line) => (
                    <>
                      {line}
                      <br />
                    </>
                  ))
                : content}
            </p>
          )}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Actions fullWidth={fullWidth} actions={actions} />
        </Suspense>
      </div>
    </div>
  );
};

export default Card;
