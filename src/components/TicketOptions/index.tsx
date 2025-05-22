'use client';
import React, { useState, useMemo, useCallback } from 'react';
import styles from './options.module.css';
import Container from '../Container';
import LockUp from '@/components/Common/lockup';
import { iFullEvent, iSize, iTheme, iVariant } from '@/lib/types';
import Gallery from '../Gallery';
import { checkEventAvailability, scrollToElement } from '@/lib/helpers';
import Actions from '@/components/Common/Actions';
import Accordion from '../accordian';
import { MdOutlineErrorOutline, MdOutlineOpenInNew } from 'react-icons/md';
import { useUser } from '@stackframe/stack';
import toast from 'react-hot-toast';
import { useGlobalContext } from '@/context/TopNavContext';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { SiFsecure, SiPayhip, SiTrustpilot } from 'react-icons/si';
import Input from '../Common/input';
import Link from 'next/link';
import Modal from '../Modal';
import Stars from '../Stars';

interface iTicketOptions {
  eventDetails: iFullEvent;
}

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    const uuid = value.toString(16);
    return uuid;
  });
};

const TicketOptions: React.FC<iTicketOptions> = ({ eventDetails }) => {
  const user = useUser();
  const { isMobile } = useGlobalContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedType, setSelectedType] = useState(
    eventDetails?.ticketTypes[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = useMemo(
    () => selectedType?.price * quantity,
    [selectedType, quantity]
  );

  const formData: Record<string, string> = useMemo(
    () => ({
      merchant_id: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '', // REQUIRED
      merchant_key: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || '', // REQUIRED
      return_url: process.env.NEXT_PUBLIC_PAYFAST_RETURN_URL || '', // OPTIONAL
      cancel_url: process.env.NEXT_PUBLIC_PAYFAST_CANCEL_URL || '', // OPTIONAL
      notify_url: process.env.NEXT_PUBLIC_PAYFAST_NOTIFY_URL || '', // OPTIONAL
      name_first: user?.displayName?.split(' ')[0] || 'Test', // OPTIONAL
      name_last: user?.displayName?.split(' ')[1] || ' ', // OPTIONAL
      email_address: user?.primaryEmail || 'support@onlyfriendsent.com',
      m_payment_id: generateUUID(), // OPTIONAL
      amount: totalCost.toFixed(2), // REQUIRED
      item_name: `${eventDetails?.title} - ${selectedType.name} - ticket`, // REQUIRED
      item_description: eventDetails?.overview.slice(0, 255), // OPTIONAL
      custom_int1: '1', // OPTIONAL
      custom_str1: user?.id || 'guest', // Include user ID or 'guest' if not logged in
      custom_str2: selectedType.id.toString(), //link the transaction to a ticket type
      custom_str3: user?.primaryEmailVerified.toString() || '', // OPTIONAL
      email_confirmation: '1', // OPTIONAL
      confirmation_address: user?.primaryEmail || 'support@onlyfriendsent.com', // OPTIONAL
      signature: '', // Placeholder for signature
    }),
    [
      user?.displayName,
      user?.primaryEmail,
      user?.id,
      user?.primaryEmailVerified,
      totalCost,
      eventDetails?.title,
      eventDetails?.overview,
      selectedType?.name,
      selectedType?.id,
    ]
  );

  const handleBuyNow = useCallback(() => {
    if (!isAgreed) {
      toast.error(
        'You must agree to the Ticket Buyer Policy before proceeding.'
      );
      return;
    }

    setIsProcessing(true);

    const form = document.createElement('form');
    form.action = process.env.NEXT_PUBLIC_PAYFAST_URL || '#';
    form.method = 'post';

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);

    sessionStorage.setItem(
      'transactionDetails',
      JSON.stringify({
        ...formData,
        eventDetails: {
          id: eventDetails?.id,
          title: eventDetails?.title,
        },
      })
    );

    toast.success('Redirecting to PayFast for payment. Please wait...');
    form.submit();
  }, [formData, eventDetails, isAgreed]);

  return (
    <Container>
      <div className={styles.ticketOptions} id="eventDetails">
        <div className={styles.ticketDetails}>
          <LockUp title="Event Ticket" theme={iTheme.Dark} size={iSize.Large} />
          <div className={styles.priceReview}>
            <span className={styles.price}>R{totalCost}</span>
            <span className={styles.seperator} />
            <span className={styles.reviews}>
              {<Stars rating={4} withText={true} />}
            </span>
          </div>

          <div className={styles.date}>
            <strong>Cut-off Date: </strong>
            <span>
              {new Date(eventDetails?.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className={styles.type}>
            <span>Type:</span>
            <Actions
              actions={[
                ...eventDetails?.ticketTypes?.map((type) => ({
                  label: `R${type.price} ${type.name} (${type.availability})`,
                  click: () => setSelectedType(type),
                  disabled: type.availability === 0 || isProcessing,
                  iconEnd: type.availability === 0 && <MdOutlineErrorOutline />,
                  variant:
                    type.name === selectedType?.name
                      ? iVariant.Primary
                      : iVariant.Secondary,
                })),
                {
                  label: 'VIP (Unavailable)',
                  click: () => {},
                  disabled: true,
                  iconEnd: <MdOutlineErrorOutline />,
                  variant: iVariant.Secondary,
                  hide: eventDetails?.ticketTypes?.some(
                    (type) => type.name === 'VIP'
                  ),
                },
              ].filter(Boolean)}
            />
          </div>

          <div className={styles.quantity}>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              label="Quantity"
              value={quantity}
              className={styles.quantityInput}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled
            />
            <span>{quantity > 1 ? 'Tickets' : 'Ticket'}</span>
          </div>

          <div className={styles.controls}>
            <div
              className={`${styles.trustpilot} trustpilot-widget`}
              data-locale="en-US"
              data-template-id="56278e9abfbbba0bdcd568bc"
              data-businessunit-id="68052f50faa2c0a6fcc34425"
              data-style-height="52px"
              data-style-width="100%"
            >
              <a
                href="https://www.trustpilot.com/review/onlyfriendsent.com"
                target="_blank"
                rel="noopener"
              >
                <SiTrustpilot /> Review us on Trustpilot
              </a>
            </div>
            <Actions
              fullWidth
              actions={[
                {
                  label: 'Buy Ticket',
                  click: () => setIsModalOpen(true),
                  variant: iVariant.Secondary,
                  size: iSize.Large,
                  disabled: checkEventAvailability(eventDetails),
                  iconEnd: <MdOutlineOpenInNew />,
                },
                {
                  label: 'View Ticket Options',
                  click: () => scrollToElement('ticketOptions'),
                  variant: iVariant.Primary,
                  size: iSize.Large,
                  iconEnd: <FaAngleDoubleDown />,
                },
              ]}
            />
          </div>

          <Accordion
            items={[
              {
                title: 'Ticket Delivery',
                content:
                  'Tickets will be delivered electronically via email. Ensure you provide a valid email address during checkout. Enjoy the convenience of instant access to your tickets!',
                id: 'acc-shipping',
              },
              {
                title: 'Returns/Refunds',
                content:
                  "All ticket sales are final. In the event of a cancellation, refunds will be processed according to the event organizer's policy. Please review our terms for more information.",
                id: 'acc-return',
              },
            ]}
          />
        </div>

        <div className={styles.gallery}>
          {isMobile && (
            <LockUp
              title="Event Gallery"
              subtitle="Explore captivating images from our past events and venue."
              theme={iTheme.Dark}
              size={iSize.Large}
            />
          )}
          <Gallery images={eventDetails?.images} variant={iVariant.Secondary} />
        </div>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} title="Payment Details">
            <p>
              Your payment will be `processed securely via PayFast. Please
              ensure your details are correct before proceeding.
            </p>
            <p>
              By proceeding, you agree to our{' '}
              <Link
                className={styles.link}
                href="/policies/ticket-buyer"
                target="_blank"
              >
                Ticket Buyer Policy
              </Link>
              .
            </p>
            <br />
            {/* secure icons and payment icons */}
            <div className={styles.icons}>
              <SiPayhip className={styles.icon} />
              <SiTrustpilot className={styles.icon} />
              <SiFsecure className={styles.icon} />
            </div>

            <div className={styles.agreement}>
              <Input
                type="checkbox"
                id="agreePolicy"
                label="I agree to the Ticket Buyer Policy:"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
            </div>

            <Actions
              actions={[
                {
                  label: 'Proceed to Payment',
                  click: handleBuyNow,
                  variant: iVariant.Primary,
                  size: iSize.Small,
                  disabled: !isAgreed || isProcessing,
                  isLoading: isProcessing,
                },
              ]}
            />
          </Modal>
        )}
      </div>
    </Container>
  );
};

export default TicketOptions;
