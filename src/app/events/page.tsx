'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './AdminEventsPage.module.css';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import TableSkeleton from '@/components/skeletons/Table';
import Actions from '@/components/Common/Actions';
import { iButtonType } from '@/components/Common/button';
import { iVariant } from '@/lib/types';

interface iEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  status: string;
  organizer: string;
}

const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<iEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/events`
      );
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateEventStatus = async (eventId: number, newStatus: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/status`,
        {
          status: newStatus,
        }
      );
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      );
    } catch (err) {
      console.error('Error updating event status:', err);
      alert('Failed to update event status. Please try again.');
    }
  };

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <h1>Admin - Review Events</h1>
        {error && <p className={styles.error}>{error}</p>}
        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <div className={styles.tableWrapper}>
            <table className="dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Organizer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event: iEvent) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.location}</td>
                    <td>{event.organizer}</td>
                    <td>{event.status}</td>
                    <td>
                      <Actions
                        actions={[
                          {
                            label: 'Approve',
                            type: iButtonType.Button,
                            variant: iVariant.Primary,
                            click: () =>
                              updateEventStatus(event.id, 'Approved'),
                          },
                          {
                            label: 'Reject',
                            type: iButtonType.Button,
                            variant: iVariant.Secondary,
                            click: () =>
                              updateEventStatus(event.id, 'Rejected'),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminEventsPage;
