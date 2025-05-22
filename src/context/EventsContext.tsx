'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { iFullEvent } from '@/lib/types';
import { fetchEvents } from '@/lib/helpers';

interface EventsContextProps {
  events: iFullEvent[];
  filteredEvents: iFullEvent[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    dateRange: { startDate: string; endDate: string };
    location: string;
    searchQuery: string;
  };
  categories: string[];
  locations: string[];
  setFilters: (filters: Partial<EventsContextProps['filters']>) => void;
  resetFilters: () => void;
}

const EventsContext = createContext<EventsContextProps>({
  events: [],
  filteredEvents: [],
  isLoading: false,
  error: null,
  filters: {
    category: '',
    dateRange: { startDate: '', endDate: '' },
    location: '',
    searchQuery: '',
  },
  categories: [],
  locations: [],
  setFilters: () => {},
  resetFilters: () => {},
});

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<iFullEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<iFullEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<EventsContextProps['filters']>({
    category: '',
    dateRange: { startDate: '', endDate: '' },
    location: '',
    searchQuery: '',
  });

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEvents();
        setEvents(data);
        setFilteredEvents(data);

        // extra unique categories from events
        const uniqueCategories = Array.from(
          new Set(
            data
              .filter((event) => event.category.trim() !== '')
              .map((event) => event.category)
          )
        );

        setCategories(uniqueCategories);

        // extra unique locations from events
        const uniqueLocations = Array.from(
          new Set(data.map((event) => event.location))
        );
        setLocations(uniqueLocations);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...events];

      if (filters.category) {
        filtered = filtered.filter(
          (event) => event.category === filters.category
        );
      }

      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        filtered = filtered.filter(
          (event) =>
            new Date(event.date) >= new Date(filters.dateRange.startDate) &&
            new Date(event.date) <= new Date(filters.dateRange.endDate)
        );
      }

      if (filters.location) {
        filtered = filtered.filter((event) =>
          event.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.searchQuery) {
        filtered = filtered.filter((event) =>
          event.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
      }

      setFilteredEvents(filtered);
    };

    applyFilters();
  }, [filters, events]);

  const setFilters = (newFilters: Partial<EventsContextProps['filters']>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      category: '',
      dateRange: { startDate: '', endDate: '' },
      location: '',
      searchQuery: '',
    });
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        filteredEvents,
        isLoading,
        error,
        filters,
        setFilters,
        resetFilters,
        categories,
        locations,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => useContext(EventsContext);
