'use client';
import React, { useState } from 'react';
import styles from './events.module.css';
import Image from 'next/image';
import { iFullEvent, iSize, iTheme } from '@/lib/types';
import EventHighlight from '../TopBanner/components/EventHighlight';
import LockUp from '../Common/lockup';

interface EventListProps {
  events: iFullEvent[]; // Already filtered and sorted events
  currentPage: number;
  ITEMS_PER_PAGE: number;
}

const EventList: React.FC<EventListProps> = ({
  events,
  currentPage,
  ITEMS_PER_PAGE,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<iFullEvent | null>(
    events[0] || null
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className={styles.eventListContainer}>
      {/* Selected Event on the Left */}
      {selectedEvent && (
        <div className={styles.selectedEvent}>
          <EventHighlight mode="single" event={selectedEvent} />
        </div>
      )}

      {/* Remaining Events as a List on the Right */}
      <div className={styles.eventList}>
        {selectedEvents.map((event) => (
          <div
            key={event.id}
            className={`${styles.eventItem} ${
              selectedEvent?.id === event.id ? styles.active : ''
            }`}
            onClick={() => setSelectedEvent(event)}
          >
            <div className={styles.eventItemImage}>
              <Image
                src={event.images[0]}
                alt={event.title}
                width={190}
                height={150}
              />
            </div>
            <div className={styles.eventItemDetails}>
              <LockUp
                overline={event.location}
                title={event.title}
                subtitle={event.date}
                theme={iTheme.Dark}
                size={iSize.Small}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
