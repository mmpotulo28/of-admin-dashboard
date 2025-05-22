'use client';
import React from 'react';
import styles from './qrCodeModal.module.css';
import QRCode from 'react-qr-code';
import { FaTimes } from 'react-icons/fa';
import LockUp from '@/components/Common/lockup';
import { iTheme } from '@/lib/types';

interface QRCodeModalProps {
  value: string;
  size: number;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ value, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <LockUp title="Scan QR Code" theme={iTheme.Dark} />
          <FaTimes className={styles.closeIcon} onClick={onClose} />
        </div>
        {typeof window !== 'undefined' && <QRCode value={value} />}
      </div>
    </div>
  );
};

export default QRCodeModal;
