import React, { useCallback } from 'react';
import styles from './shareModal.module.css';
import {
  FaTimes,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaWhatsapp,
} from 'react-icons/fa';
import Actions from '@/components/Common/Actions';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme } from '@/lib/types';
import { iButtonType, iTarget } from '@/components/Common/button';

interface ShareModalProps {
  onClose: () => void;
  ticketId?: number;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, ticketId }) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/tickets?id=${ticketId}`;

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(url);
    alert('Ticket URL copied to clipboard!');
  }, [url]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <LockUp title="Share Ticket" theme={iTheme.Dark} />
          <FaTimes className={styles.closeIcon} onClick={onClose} />
        </div>
        <div className={styles.shareOptions}>
          <Actions
            // fullWidth
            actions={[
              {
                label: 'Facebook',
                iconStart: <FaFacebook />,
                type: iButtonType.Link,
                url: {
                  link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                  target: iTarget.Blank,
                },
                size: iSize.Medium,
              },
              {
                label: 'Twitter',
                iconStart: <FaTwitter />,
                type: iButtonType.Link,
                url: {
                  link: `https://twitter.com/intent/tweet?url=${url}`,
                  target: iTarget.Blank,
                },
                size: iSize.Medium,
              },
              {
                label: 'LinkedIn',
                iconStart: <FaLinkedin />,
                type: iButtonType.Link,
                url: {
                  link: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
                  target: iTarget.Blank,
                },
                size: iSize.Medium,
              },
              {
                label: 'WhatsApp',
                iconStart: <FaWhatsapp />,
                type: iButtonType.Link,
                url: {
                  link: `https://wa.me/?text=${encodeURIComponent(url)}`,
                  target: iTarget.Blank,
                },
                size: iSize.Medium,
              },
              {
                label: 'Copy Link',
                iconStart: <FaCopy />,
                click: handleCopyLink,
                size: iSize.Medium,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
