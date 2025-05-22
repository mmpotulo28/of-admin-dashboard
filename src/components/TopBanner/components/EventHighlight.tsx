import React, { useState, useEffect, useMemo } from 'react';
import styles from './hightlight.module.css';
import LockUp from '@/components/Common/lockup';
import { iFullEvent, iSize, iTheme, iVariant } from '@/lib/types';
import Actions from '@/components/Common/Actions';
import { FaAngleRight } from 'react-icons/fa';
import { iButtonType } from '@/components/Common/button';
import { formatStringForURL } from '@/lib/helpers';
import { useEventsContext } from '@/context/EventsContext';
import EventHighlightSkeleton from './EventHighlightSkeleton';
import Image from 'next/image';

interface EventHighlightProps {
  mode: 'single' | 'slider';
  event?: iFullEvent;
  variant?: iVariant;
  size?: iSize;
}

const EventHighlight: React.FC<EventHighlightProps> = ({
  mode,
  event,
  variant = iVariant.Primary,
  size = iSize.Medium,
}) => {
  const { events, isLoading } = useEventsContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentIndex((prevIndex) =>
          mode === 'slider'
            ? (prevIndex + 1) % events.length
            : event?.images
            ? (prevIndex + 1) % event.images.length
            : 0
        );
      },
      mode === 'slider' ? 5000 : 4000
    );

    return () => clearInterval(interval);
  }, [mode, event, events]);

  const currentEvent = useMemo(
    () => (mode === 'slider' ? events[currentIndex] : event),
    [mode, currentIndex, event, events]
  );

  const backgroundImage = useMemo(
    () =>
      currentEvent?.images
        ? currentEvent.images[
            mode === 'slider'
              ? currentIndex
              : currentIndex % currentEvent.images.length
          ] || currentEvent.images[0]
        : '',
    [currentEvent, currentIndex, mode]
  );

  // no event checks
  if (mode === 'single' && !event) return null;
  if (mode === 'slider' && events?.length === 0) return null;
  if (isLoading) return <EventHighlightSkeleton size={size} />;
  if (!currentEvent) return null;
  if (currentEvent.images.length === 0) return null;

  return (
    <div
      className={`${styles.highlight} ${styles[mode]} ${styles[variant]} ${styles[size]}`}
    >
      <Image
        className={styles.backgroundImage}
        src={backgroundImage.trim()}
        alt={currentEvent.title}
        objectFit="cover"
        layout="cover"
        width={100}
        height={100}
      />

      {currentIndex === 0 ? (
        <div className={styles.overlay}>
          <div className={styles.bottom}>
            <Actions
              actions={[
                {
                  label: 'Checkout it out',
                  iconEnd: <FaAngleRight />,
                  variant: iVariant.Tertiary,
                  type: iButtonType.Link,
                  url: {
                    link: `/checkout/${formatStringForURL(currentEvent.title)}`,
                  },
                },
              ]}
            />
          </div>
        </div>
      ) : (
        <div className={styles.overlay}>
          <LockUp
            overline={currentEvent.organiser.name}
            title={currentEvent.title}
            subtitle={currentEvent.location}
            theme={iTheme.Light}
            size={iSize.Large}
            centered
          />

          <div>
            <LockUp
              title={currentEvent.date}
              theme={iTheme.Light}
              size={iSize.Small}
              centered
            />

            <div className={styles.tickets}>
              {currentEvent?.ticketTypes.map(({ name, price }) => (
                <p key={name}>
                  R{price} - <span>{name}</span>
                </p>
              ))}
            </div>
          </div>

          <div className={styles.bottom}>
            <Actions
              actions={[
                {
                  label: 'Checkout it out',
                  iconEnd: <FaAngleRight />,
                  variant: iVariant.Tertiary,
                  type: iButtonType.Link,
                  url: {
                    link: `/checkout/${formatStringForURL(currentEvent.title)}`,
                  },
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHighlight;
