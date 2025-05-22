'use client';
import React, { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';
import Actions from '../Actions';
import { BiCheckShield } from 'react-icons/bi';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cookieConsent='));
    if (!consentCookie) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      setIsVisible(false);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 15); // Set expiration to 15 days
      document.cookie = `cookieConsent=true; expires=${expirationDate.toUTCString()}; path=/`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.cookieConsentContainer}>
      <p>
        We use cookies to improve your experience and ensure secure
        transactions. By using this site, you agree to our{' '}
        <a href="/policies/ticket-buyer" className={styles.cookieConsentLink}>
          Ticket Buyer Terms and Conditions
        </a>
        .
      </p>
      <Actions
        actions={[
          {
            label: 'Accept',
            click: handleAccept,
            iconStart: <BiCheckShield />,
          },
        ]}
      />
    </div>
  );
}
