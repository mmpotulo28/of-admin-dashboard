import React, { JSX } from 'react';
import styles from './modal.module.css';
import LockUp from '../Common/lockup';
import { iTheme } from '@/lib/types';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  full?: boolean;
  title?: string;
}

/**
 * Modal component that displays its children inside a modal dialog.
 * The modal can be closed by clicking on the overlay, pressing the Escape key,
 * or clicking the close button.
 *
 * @param {ModalProps} props - The properties for the Modal component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @param {() => void} props.onClose - The function to be called when the modal is requested to be closed.
 *
 * @returns {JSX.Element} The rendered Modal component.
 */
const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  full = false,
  title,
}: ModalProps): JSX.Element => {
  const handleOverlayClick = () => onClose();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className={`${styles.modalOverlay} `}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`${styles.modalContent} ${full ? styles.full : ''}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {title && <LockUp title={title} theme={iTheme.Dark} />}
        {children}
      </div>
    </div>
  );
};

export default Modal;
