import styles from './similar-events.module.css';
import { iFullEvent, iSize, iTheme, iVariant } from '@/lib/types';
import EventHighlight from '@/components/TopBanner/components/EventHighlight';
import LockUp from '@/components/Common/lockup';
import Container from '@/components/Container';
import { useMemo, useRef } from 'react';
import Pagination from '@/components/pagination';
import { useEventsContext } from '@/context/EventsContext';
import SimilarEventsSkeleton from './SimilarEventsSkeleton';
import Actions from '@/components/Common/Actions';
import { BsArrowRight } from 'react-icons/bs';
import { iButtonType } from '@/components/Common/button';
import { useGlobalContext } from '@/context/TopNavContext';

interface iSimilarEventsProps {
  title?: string;
  currentEvent?: iFullEvent;
  theme?: iTheme;
}

const SimilarEvents: React.FC<iSimilarEventsProps> = ({
  currentEvent,
  title = 'Similar Events',
  theme = iTheme.Light,
}) => {
  const { events, isLoading } = useEventsContext();
  const { isMobile } = useGlobalContext();
  const gridRef = useRef<HTMLDivElement>(null);

  const similarEvents = useMemo(() => {
    if (!currentEvent) return events || [];

    return events.filter((event) => {
      const isSameCategory = event.category === currentEvent.category;
      const isSameLocation = event.location === currentEvent.location;
      const hasCommonTags = currentEvent.tags?.some((tag) =>
        event.tags?.includes(tag)
      );
      const isDifferentEvent = event.id !== currentEvent.id;

      return (
        (isDifferentEvent &&
          (isSameCategory || isSameLocation || hasCommonTags)) ||
        true
      );
    });
  }, [currentEvent, events]);

  const scrollLeft = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({
        left: -(Number(gridRef.current.clientWidth) + 30),
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({
        left: Number(gridRef.current.clientWidth) + 30,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) return <SimilarEventsSkeleton />;
  if (currentEvent) {
    return null;
  }
  if (!isLoading && similarEvents.length === 0) return null; // No similar events to show

  return (
    <Container theme={theme} fullWidth padded={!isMobile}>
      <Container theme={theme} fullWidth>
        <div
          id="similarEvents"
          className={`${styles.similarEvents} ${styles[theme]}`}
        >
          <div className={styles.header}>
            <LockUp
              overline="Checkout these!"
              title={title}
              theme={theme == iTheme.Dark ? iTheme.Light : iTheme.Dark}
              size={iSize.Large}
            />

            <Actions
              actions={[
                {
                  label: 'See all',
                  iconEnd: <BsArrowRight />,
                  variant: iVariant.Secondary,
                  size: iSize.Small,
                  type: iButtonType.Link,
                  url: {
                    link: '/events',
                  },
                },
              ]}
            />
          </div>

          <div ref={gridRef} className={styles.grid}>
            {similarEvents?.map((event) => (
              <EventHighlight
                key={event.id}
                mode="single"
                event={event}
                size={iSize.Small}
              />
            ))}
          </div>

          {similarEvents.length > 0 && (
            <Pagination
              currentPage={similarEvents.length}
              onNextPage={scrollRight}
              onPrevPage={scrollLeft}
              onPageClick={() => {}}
              totalItems={similarEvents.length}
            />
          )}
        </div>
      </Container>
    </Container>
  );
};

export default SimilarEvents;
