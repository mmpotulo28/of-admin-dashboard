'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import styles from './AdminVenuesPage.module.css';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import TableSkeleton from '@/components/skeletons/Table';
import Modal from '@/components/Modal';
import { iSize, iStatus, iTheme, iVariant, iVenue } from '@/lib/types';
import LockUp from '@/components/Common/lockup';
import Actions from '@/components/Common/Actions';
import Insight from '@/components/Dashboard/Insights';
import { BiEditAlt, BiUserCircle } from 'react-icons/bi';
import { FaLocationPinLock } from 'react-icons/fa6';

const AdminVenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<iVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<iVenue | null>(null);
  const [updatingVenueId, setUpdatingVenueId] = useState<number | null>(null);

  const fetchVenues = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/venues`
      );
      setVenues(
        response.data.map((venue: iVenue) => ({
          ...venue,
          accessibilityOptions: venue.accessibilityOptions || [],
        }))
      );
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to fetch venues. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const updateVenueStatus = async (venueId: number, newStatus: iStatus) => {
    setUpdatingVenueId(venueId);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/venues/update-status/${venueId}/${newStatus}`
      );
      setVenues((prev) =>
        prev.map((venue) =>
          venue.id === venueId
            ? { ...venue, applicationStatus: newStatus }
            : venue
        )
      );
    } catch (err) {
      console.error('Error updating venue status:', err);
      alert('Failed to update venue status. Please try again.');
    } finally {
      setUpdatingVenueId(null);
      setSelectedVenue(null);
    }
  };

  const totalVenues = venues.length;
  const approvedVenues = useMemo(
    () =>
      venues.filter((venue) => venue.applicationStatus === iStatus.Approved)
        .length,
    [venues]
  );
  const pendingVenues = useMemo(
    () =>
      venues.filter((venue) => venue.applicationStatus === iStatus.Pending)
        .length,
    [venues]
  );
  const rejectedVenues = useMemo(
    () =>
      venues.filter((venue) => venue.applicationStatus === iStatus.Rejected)
        .length,
    [venues]
  );
  const suspendedVenues = useMemo(
    () =>
      venues.filter((venue) => venue.applicationStatus === iStatus.Suspended)
        .length,
    [venues]
  );

  function statusClass(applicationStatus: iStatus) {
    switch (applicationStatus) {
      case iStatus.Approved:
        return styles.statusApproved;
      case iStatus.Pending:
        return styles.statusPending;
      case iStatus.Rejected:
        return styles.statusRejected;
      case iStatus.Suspended:
        return styles.statusSuspended;
      default:
        return '';
    }
  }

  return (
    <DashboardLayout type="admin">
      <div className={styles.container}>
        <LockUp title="Review Venues" subtitle="" theme={iTheme.Dark} />
        {error && <p className={styles.error}>{error}</p>}
        <Insight
          insights={[
            { label: 'Total Venues', value: totalVenues },
            { label: 'Approved', value: approvedVenues },
            { label: 'Pending', value: pendingVenues },
            { label: 'Rejected', value: rejectedVenues },
            { label: 'Suspended', value: suspendedVenues },
          ]}
        />
        {isLoading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <div className={styles.tableWrapper}>
            <table className="light">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Capacity</th>
                  <th>Type</th>
                  <th>Accessibility Options</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue: iVenue) => (
                  <tr key={venue.id}>
                    <td>{venue.venueName}</td>
                    <td>
                      <FaLocationPinLock /> {venue.address}
                    </td>
                    <td>
                      <BiUserCircle /> {venue.capacity}
                    </td>
                    <td>{venue.venueType}</td>
                    <td>
                      {venue.accessibilityOptions.length > 0
                        ? venue.accessibilityOptions.join(', ')
                        : 'None'}
                    </td>
                    <td className={`${statusClass(venue.applicationStatus)} `}>
                      <span className={`${styles.status}`}>
                        {venue.applicationStatus}
                      </span>
                    </td>
                    <td>
                      <Actions
                        actions={[
                          {
                            label: 'Edit',
                            iconStart: <BiEditAlt />,
                            variant: iVariant.Secondary,
                            size: iSize.Small,
                            isLoading: updatingVenueId === venue.id,
                            disabled: updatingVenueId !== null,
                            click: () => setSelectedVenue(venue),
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
        {selectedVenue && (
          <Modal
            onClose={() => setSelectedVenue(null)}
            title={selectedVenue.venueName}
          >
            <div className={styles.modalContent}>
              <p>
                <strong>Application Ref:</strong>{' '}
                {selectedVenue.applicationReferenceNumber}
              </p>
              <p>
                <strong>Address:</strong> {selectedVenue.address}
              </p>
              <p>
                <strong>Capacity:</strong> {selectedVenue.capacity}
              </p>
              <p>
                <strong>Type:</strong> {selectedVenue.venueType}
              </p>
              <p>
                <strong>Status:</strong> {selectedVenue.applicationStatus}
              </p>
              <Actions
                fullWidth
                actions={[
                  {
                    label: 'Approve',
                    iconStart: <BiEditAlt />,
                    variant: iVariant.Secondary,
                    size: iSize.Small,
                    isLoading: updatingVenueId === selectedVenue.id,
                    disabled: updatingVenueId !== null,
                    click: () =>
                      updateVenueStatus(selectedVenue.id, iStatus.Approved),
                  },
                  {
                    label: 'Reject',
                    iconStart: <BiEditAlt />,
                    variant: iVariant.Secondary,
                    size: iSize.Small,
                    isLoading: updatingVenueId === selectedVenue.id,
                    disabled: updatingVenueId !== null,
                    click: () =>
                      updateVenueStatus(selectedVenue.id, iStatus.Rejected),
                  },
                  {
                    label: 'Suspend',
                    iconStart: <BiEditAlt />,
                    variant: iVariant.Secondary,
                    size: iSize.Small,
                    isLoading: updatingVenueId === selectedVenue.id,
                    disabled: updatingVenueId !== null,
                    click: () =>
                      updateVenueStatus(selectedVenue.id, iStatus.Suspended),
                  },
                ]}
              />
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminVenuesPage;
