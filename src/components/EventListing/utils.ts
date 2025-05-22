import { iFullEvent } from '@/lib/types';
import { Dispatch, SetStateAction, RefObject, ChangeEvent } from 'react';

/**
 * Advances to the next page of events, ensuring the page number does not exceed the total number of pages.
 *
 * @param setCurrentPage - A state setter function to update the current page number.
 * @param filteredEvents - An array of events that have been filtered based on some criteria.
 * @param ITEMS_PER_PAGE - The number of items to display per page.
 */
export const handleNextPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>,
  filteredEvents: iFullEvent[],
  ITEMS_PER_PAGE: number
) => {
  setCurrentPage((prevPage) =>
    Math.min(prevPage + 1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE))
  );
};

export const handlePreviousPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>
) => {
  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
};

export const handleCategoryChange = (
  category: string,
  setSelectedCategory: Dispatch<SetStateAction<string>>,
  setCurrentPage: Dispatch<SetStateAction<number>>
) => {
  setSelectedCategory(category);
  setCurrentPage(1); // Reset to first page when category changes
};

export const handleScrollLeft = (tabsRef: RefObject<HTMLDivElement | null>) => {
  if (tabsRef?.current) {
    tabsRef.current.scrollLeft -= 50; // Adjust the scroll amount as needed
  }
};

/**
 * Scrolls the content of the given tabs container to the right by a specified amount.
 *
 * @param tabsRef - A reference to the HTMLDivElement that contains the tabs.
 *                  The function will scroll this element to the right.
 */
export const handleScrollRight = (
  tabsRef: RefObject<HTMLDivElement | null>
) => {
  if (tabsRef?.current) {
    tabsRef.current.scrollLeft += 50; // Adjust the scroll amount as needed
  }
};

/**
 * Updates the sort criteria state with the provided criteria.
 *
 * @param criteria - The new sort criteria to be set.
 * @param setSortCriteria - A state setter function to update the sort criteria.
 */
export const handleSortChange = (
  criteria: string,
  setSortCriteria: Dispatch<SetStateAction<string>>
) => {
  setSortCriteria(criteria);
};

/**
 * Toggles the sort direction between "asc" (ascending) and "desc" (descending).
 *
 * @param setSortDirection - A state setter function to update the sort direction.
 */
export const handleSortDirectionChange = (
  setSortDirection: Dispatch<SetStateAction<string>>
) => {
  setSortDirection((prevDirection) =>
    prevDirection === 'asc' ? 'desc' : 'asc'
  );
};

/**
 * Handles the change event for a search input field.
 * Updates the search query state and resets the current page to the first page.
 *
 * @param e - The change event from the search input field.
 * @param setSearchQuery - Function to update the search query state.
 * @param setCurrentPage - Function to update the current page state.
 */
export const handleSearchChange = (
  e: ChangeEvent<HTMLInputElement>,
  setSearchQuery: Dispatch<SetStateAction<string>>,
  setCurrentPage: Dispatch<SetStateAction<number>>
) => {
  setSearchQuery(e.target.value);
  setCurrentPage(1); // Reset to first page when search query changes
};

/**
 * Sorts an array of events based on the specified criteria and direction.
 *
 * @param {iFullEvent[]} events - The array of events to be sorted.
 * @param {string} sortCriteria - The criteria to sort the events by. Can be "date", "location", or "category".
 * @param {string} sortDirection - The direction to sort the events in. Can be "asc" for ascending or "desc" for descending.
 * @returns {iFullEvent[]} The sorted array of events.
 */
export const sortEvents = (
  events: iFullEvent[],
  sortCriteria: string,
  sortDirection: string
) => {
  return events.sort((a, b) => {
    if (sortCriteria === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    } else if (sortCriteria === 'location') {
      return sortDirection === 'asc'
        ? a.location.localeCompare(b.location)
        : b.location.localeCompare(a.location);
    } else if (sortCriteria === 'category') {
      return sortDirection === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });
};
