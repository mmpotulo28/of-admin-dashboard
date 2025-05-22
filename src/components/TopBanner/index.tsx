'use client';
import React, { Suspense } from 'react';
import styles from './topBanner.module.css';
import Actions from '@/components/Common/Actions';
import LockUp from '@/components/Common/lockup';
import { iButtonProps } from '@/components/Common/button';
import { useGlobalContext } from '@/context/TopNavContext';
import { iSize, iTheme, iVariant } from '@/lib/types';
import EventHighlight from './components/EventHighlight';
import EventFilterForm from './components/EventFilterForm';
import EventHighlightSkeleton from './components/EventHighlightSkeleton';

interface iTopBannerProps {
  overline?: string;
  title?: string;
  subline?: string;
  content?: string;
  actions?: iButtonProps[];
  reverse?: boolean;
  variant?: iVariant;
}

const TopBanner: React.FC<iTopBannerProps> = ({
  title,
  content,
  actions,
  variant = iVariant.Primary,
}) => {
  const { isMobile } = useGlobalContext();
  return (
    <div className={`${styles.topBanner} ${isMobile ? styles.centered : ''}`}>
      <div className={styles.bannerContent + ' slideInLeft'}>
        <LockUp
          bold
          centered={isMobile}
          size={iSize.Large}
          title={title || ''}
          theme={iTheme.Dark}
        />

        {variant === iVariant.Primary ? (
          <div className={styles.bannerText}>
            <p>{content}</p>
          </div>
        ) : (
          <div className={styles.bannerForm}>
            <EventFilterForm />
          </div>
        )}

        <Suspense fallback={<div>Loading actions...</div>}>
          <Actions actions={actions} />
        </Suspense>
      </div>

      <div className={styles.rightContent}>
        <div className={`slideInRight ${styles.widget}`}>
          <Suspense fallback={<EventHighlightSkeleton />}>
            <EventHighlight mode="slider" />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
