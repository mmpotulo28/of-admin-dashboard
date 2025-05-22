import { Suspense } from 'react';
// import GradientUp from '../TopBanner/gradientUp';
import styles from './eventBanner.module.css';
import EventBannerSkeleton from './eventBannerSkeleton';
import { DetailsLeft, DetailsRight } from './components';
import { iFullEvent } from '@/lib/types';

/**
 * EventBanner component displays the banner for an event.
 *
 * @param {Object} props - The props for the component.
 * @param {iFullEvent} props.event - The event data to display.
 */
const EventBanner: React.FC<{ event: iFullEvent }> = ({ event }) => (
  <div className={styles.eventBanner}>
    <Suspense fallback={<EventBannerSkeleton />}>
      <div className={styles.details}>
        <DetailsLeft event={event} />
        <DetailsRight event={event} />
      </div>
    </Suspense>
  </div>
);

export default EventBanner;
