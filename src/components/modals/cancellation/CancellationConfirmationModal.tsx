import React from 'react';
import Modal from '@/components/Modal';
import { iFullEvent, iSize, iTheme, iVariant } from '@/lib/types';
import styles from './CancellationConfirmationModal.module.css';
import Actions from '@/components/Common/Actions';
import LockUp from '@/components/Common/lockup';

interface CancellationConfirmationModalProps {
  selectedEvent: iFullEvent | null;
  handleCloseCancellationConfirmation: () => void;
  handleRequestCancellation: () => Promise<void>;
}

const CancellationConfirmationModal: React.FC<
  CancellationConfirmationModalProps
> = ({
  selectedEvent,
  handleCloseCancellationConfirmation,
  handleRequestCancellation,
}) => {
  if (!selectedEvent) {
    return null;
  }

  const eventStartTime = new Date(selectedEvent.date).getTime();
  const currentTime = Date.now();
  const sixHoursInMilliseconds = 6 * 60 * 60 * 1000;
  const canCancel = eventStartTime - currentTime >= sixHoursInMilliseconds;

  return (
    <Modal onClose={handleCloseCancellationConfirmation}>
      <div className={styles.container}>
        <LockUp
          title="Confirm Cancellation Request"
          subtitle={`Are you sure you want to request cancellation for ${selectedEvent.title}?`}
          theme={iTheme.Dark}
          size={iSize.Small}
        />
        {!canCancel && (
          <p className={styles.error}>
            Events cannot be canceled within 6 hours of their start time. If
            it&apos;s a must, please contact support using Our chat bot.
            <br />
            <strong>
              Please note cancellation fee might be charged as per our event
              cancellation policy
            </strong>
          </p>
        )}
        <Actions
          className={styles.actions}
          actions={[
            {
              label: 'Confirm',
              click: handleRequestCancellation,
              size: iSize.Small,
              disabled: !canCancel, // Disable the button if the event cannot be canceled
            },
            {
              label: 'Cancel',
              click: handleCloseCancellationConfirmation,
              size: iSize.Small,
              variant: iVariant.Secondary,
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default CancellationConfirmationModal;
