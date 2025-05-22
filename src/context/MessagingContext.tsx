'use client';

import { fetchEvents } from '@/lib/helpers';
import { iFullEvent } from '@/lib/types';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

interface Event {
  id: number;
  title: string;
}

interface MessagingContextProps {
  selectedEvent: number | null;
  handleEventChange: (id: number) => void;
  events: Event[];
}

const MessagingContext = createContext<MessagingContextProps | undefined>(
  undefined
);

export const MessagingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<iFullEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => {
    async function getEvents() {
      const response: iFullEvent[] = await fetchEvents();
      setEvents(response);
    }

    getEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      setSelectedEvent(events[0].id);
    }
  }, [events]);

  const handleEventChange = useCallback((id: number) => {
    setSelectedEvent(id);
  }, []);

  return (
    <MessagingContext.Provider
      value={{ selectedEvent, handleEventChange, events }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = (): MessagingContextProps => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
