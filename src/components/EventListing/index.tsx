'use client';
import React, { useState } from 'react';
import styles from './events.module.css';
import Controls from './Controls';
import EventList from './EventList';
import { sortEvents } from './utils';
import Pagination from '../pagination';
import { useEventsContext } from '@/context/EventsContext';
import Skeleton from './Skeleton'; // Import the skeleton loader component

const ITEMS_PER_PAGE = 10;

const EventListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const { filteredEvents, isLoading } = useEventsContext();

  const sortedEventsList = sortEvents(
    filteredEvents,
    sortCriteria,
    sortDirection
  );

  const paginatedEvents = sortedEventsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <Skeleton />; // Show skeleton loader when loading

  return (
    <div className={styles.events}>
      <Controls
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        setCurrentPage={setCurrentPage}
      />

      {filteredEvents.length > 0 ? (
        <EventList
          events={paginatedEvents}
          currentPage={currentPage}
          ITEMS_PER_PAGE={itemsPerPage}
        />
      ) : (
        <div>No events found.</div>
      )}

      {/* Pagination controls */}
      <Pagination
        changeItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        totalItems={filteredEvents.length}
        onNextPage={() => setCurrentPage((prev) => prev + 1)}
        onPrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onPageClick={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default EventListing;
