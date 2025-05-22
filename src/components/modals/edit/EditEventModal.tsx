import React, { useCallback, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Input from '@/components/Common/input';
import Select from '@/components/Common/select';
import { FaMinusCircle } from 'react-icons/fa';
import styles from './EditEventModal.module.css';
import { iFullEvent, iSize, iTheme, iVariant, iVenue } from '@/lib/types';
import Actions from '@/components/Common/Actions';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import LockUp from '@/components/Common/lockup';
import { eventCategories } from '@/lib/data';
import { fetchVenues } from '@/lib/helpers';

export const S3 = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT, // Use environment variable for endpoint
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || '', // Use environment variable for access key ID
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || '', // Use environment variable for secret access key
  },
  region: process.env.NEXT_PUBLIC_S3_REGION || 'auto', // Use environment variable for region
});

interface EditEventModalProps {
  editEvent: iFullEvent | null;
  handleCloseEditModal: () => void;
  handleEditChange: (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => void;
  handleEditImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditTicketChange: (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLSelectElement
    >
  ) => void;
  addEditTicketType: () => void;
  removeEditTicketType: (index: number) => void;
  handleUpdateEvent: (updatedEvent: iFullEvent) => Promise<void>;
  addLog: (message: string) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  editEvent,
  handleCloseEditModal,
  handleEditChange,
  handleEditImagesChange,
  handleEditTicketChange,
  addEditTicketType,
  removeEditTicketType,
  handleUpdateEvent,
  addLog,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [venues, setVenues] = useState<iVenue[]>([]);

  useEffect(() => {
    async function getVenues() {
      const { venues, error } = await fetchVenues(true);
      if (error) {
        console.error('Error fetching venues:', error);
      } else {
        setVenues(venues);
      }

      console.log(error, venues);
    }
    getVenues();
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!editEvent) return;

    try {
      addLog(`Updating event: ${editEvent.title}`);
      addLog(`Uploading images: ${images.length} files selected`);

      const uploadedFilenames = await Promise.all(
        images.map(async (file) => {
          addLog(`Generating signed URL for: ${file.name}`);
          const signedUrl = await getSignedUrl(
            S3,
            new PutObjectCommand({
              Bucket: 'onlyfriendsent', // Updated with actual bucket name
              Key: file.name,
            }),
            {
              expiresIn: 60 * 60 * 24 * 7, // 7 days
            }
          );

          addLog(`Uploading image: ${file.name}`);
          const response = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });

          if (response.ok) {
            addLog(`Uploaded image: ${file.name}`);
            return file.name;
          } else {
            throw new Error(`Failed to upload ${file.name}`);
          }
        })
      );

      addLog('Images uploaded successfully.');

      const updatedEvent = { ...editEvent, images: uploadedFilenames };
      handleUpdateEvent(updatedEvent);
    } catch (error: any) {
      console.error(`Error updating event ${editEvent.title}:`, error);
      addLog(
        `Failed to update event ${editEvent.title}: ${
          error.message || 'Unknown error'
        }`
      );
    } finally {
      handleCloseEditModal();
    }
  }, [editEvent, handleUpdateEvent, handleCloseEditModal, addLog, images]);

  if (!editEvent) {
    return null;
  }

  return (
    <Modal onClose={handleCloseEditModal} full>
      <div className={styles.container}>
        <LockUp theme={iTheme.Dark} title={'Edit Event'} />
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <Input
            type="text"
            name="title"
            label="Title"
            value={editEvent.title}
            onChange={handleEditChange}
            required
          />
          <Input
            type="text"
            name="subtitle"
            label="Subtitle"
            value={editEvent.subtitle}
            onChange={handleEditChange}
            required
          />
          <Input
            type="date"
            name="date"
            label="Date"
            value={editEvent.date}
            onChange={handleEditChange}
            required
          />
          <Input
            type="time"
            name="startTime"
            label="Start Time"
            value={editEvent.startTime}
            onChange={handleEditChange}
            required
          />
          <Input
            type="time"
            name="endTime"
            label="End Time"
            value={editEvent.endTime}
            onChange={handleEditChange}
            required
          />
          <Select
            name="venue"
            label="Venue"
            value={editEvent.location}
            handleSelectChange={(e) => handleEditChange(e)}
            options={venues.map((venue) => ({
              value: venue.address,
              label: venue.venueName || venue.address,
            }))}
            required
          />
          <Select
            name="category"
            label="Category"
            value={editEvent.category}
            handleSelectChange={(e) => handleEditChange(e)}
            options={eventCategories}
            required
          />
          <Input
            type="text"
            name="tags"
            label="Tags"
            value={editEvent.tags.join(', ')}
            onChange={handleEditChange}
            required
          />
          <Input
            type="file"
            name="images"
            label="Images"
            multiple
            onChange={(e) => {
              handleEditImagesChange(e);
              setImages(Array.from(e.target.files || []));
            }}
          />
          <div className={styles.formGroup}>
            <label>Overview</label>
            <textarea
              name="overview"
              value={editEvent.overview}
              onChange={handleEditChange}
              required
            />
          </div>
          {editEvent.ticketTypes.map((type, index) => (
            <div key={index} className={styles.ticketType}>
              <Select
                name="name"
                label="Ticket Type"
                value={type.name}
                handleSelectChange={(e) => handleEditTicketChange(index, e)}
                options={[
                  { value: 'General', label: 'General' },
                  { value: 'VIP', label: 'VIP' },
                  { value: 'early-bird', label: 'Early Bird' },
                ]}
                required
              />
              <Input
                type="text"
                name="description"
                label="Short description"
                value={type.description}
                onChange={(e) => handleEditTicketChange(index, e)}
                required
              />
              <Input
                type="number"
                name="price"
                label="Price"
                value={type.price}
                onChange={(e) => handleEditTicketChange(index, e)}
                required
              />
              <Input
                type="number"
                name="availability"
                label="Availability"
                value={type.availability}
                onChange={(e) => handleEditTicketChange(index, e)}
                required
              />
              <Input
                type="text"
                name="features"
                label="Features"
                value={type.features.join(', ')}
                onChange={(e) => handleEditTicketChange(index, e)}
                required
              />
              <button
                type="button"
                onClick={() => removeEditTicketType(index)}
                className={styles.removeButton}
              >
                <FaMinusCircle />
              </button>
            </div>
          ))}
          <Actions
            className={styles.actions}
            actions={[
              {
                label: 'Add Ticket Type',
                click: addEditTicketType,
                size: iSize.Small,
                variant: iVariant.Secondary,
              },
              {
                label: 'Update Event',
                click: handleUpdate,
                size: iSize.Small,
              },
            ]}
          />
        </form>
      </div>
    </Modal>
  );
};

export default EditEventModal;
