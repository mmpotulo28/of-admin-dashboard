import React, { useState } from 'react';
import styles from './transferModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { iTheme } from '@/lib/types';
import LockUp from '@/components/Common/lockup';

export interface iTransferModalProps {
  onClose: () => void;
  onSubmit: (email: string) => void;
  title: string;
  label: string;
  placeholder: string;
}

const TransferModal: React.FC<iTransferModalProps> = ({
  onClose,
  onSubmit,
  title,
  label,
  placeholder,
}) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onSubmit(email);
      setError('');
    } else {
      setError('Please enter a valid email address.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <LockUp title={title} theme={iTheme.Dark} />
          <FaTimes className={styles.closeIcon} onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">{placeholder}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'someone@gmail.com'}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            {label}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
