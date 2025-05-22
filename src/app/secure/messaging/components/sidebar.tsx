'use client';
import { JSX, useMemo } from 'react';
import styles from '../messaging.module.css';
import Actions from '@/components/Common/Actions';
import LockUp from '@/components/Common/lockup';
import { FaComments } from 'react-icons/fa';
import { iButtonProps } from '@/components/Common/button';
import { useMessaging } from '@/context/MessagingContext';
import { iVariant, iTheme, iSize } from '@/lib/types';

const MessagingSidebar: React.FC = (): JSX.Element => {
  const { selectedEvent, handleEventChange, events } = useMessaging();

  const actions: iButtonProps[] = useMemo(
    () =>
      events.map((event) => ({
        label: event.title,
        iconStart: <FaComments />,
        disabled: selectedEvent === event.id,
        variant: iVariant.Secondary,
        centered: false,
        click: () => handleEventChange(event.id),
        key: event.id, // Ensure unique keys
      })),
    [selectedEvent, handleEventChange, events]
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <LockUp
          title="Event Channels"
          subtitle="Chat with you attendees"
          theme={iTheme.Light}
          size={iSize.Small}
        />
      </div>
      <div className={styles.eventList}>
        <Actions fullWidth actions={actions} />
      </div>
    </div>
  );
};

export default MessagingSidebar;
