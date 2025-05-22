import React from 'react';
import styles from './displaycards.module.css';
import LockUp from '@/components/Common/lockup';
import Card, { iCardProps, iOrientation } from '../card';
import { iLockUpProps, iTheme, iSize } from '@/lib/types';

const lockUpInfo: iLockUpProps = {
  title: 'Your Ticketing Journey',
  subtitle: 'Discover events, purchase tickets, and receive confirmations.',
  theme: iTheme.Dark,
  size: iSize.Large,
};

const cardInfo: iCardProps[] = [
  {
    title: 'Step-by-Step Ticket Purchasing',
    content:
      'Browse events that interest you. Find the perfect event for you and your friends. Enjoy a seamless ticket purchasing experience.',
    image: {
      src: '/image/08605aa5-a31f-4336-93e2-f4731c5e95f0.jpg',
      alt: 'card image',
    },
    size: iSize.Medium,
    overline: 'Guide',
  },
  {
    title: 'Receive Your Confirmation Instantly',
    content:
      'Check your email for ticket details. Your confirmation will be sent immediately after purchase.\n\nGet early access to tickets, special discounts, and more.',
    image: {
      src: '/image/2f49ae06-8112-4a6d-bada-ce2208ad999e.jpg',
      alt: 'card image',
    },
    size: iSize.Medium,
    overline: 'Instant',
  },
  // {
  //   title: 'Secure Your Tickets Easily',
  //   content:
  //     'Select your desired event and seating. Enjoy a hassle-free ticket booking process. Ensure you get the best seats available.',
  //   image: {
  //     src: '/image/812574b7-ee40-4198-86bd-a54652dbcb99.jpg',
  //     alt: 'card image',
  //   },
  //   size: iSize.Medium,
  //   overline: 'Secure',
  // },
];

const DisplayCard: React.FC = () => {
  return (
    <div className={styles.displayCards}>
      <LockUp
        title={lockUpInfo.title}
        subtitle={lockUpInfo.subtitle}
        theme={lockUpInfo.theme}
        size={lockUpInfo.size}
      />

      <div className={styles.cards}>
        {cardInfo?.map((card) => (
          <Card
            key={card.title}
            overline={card.overline}
            title={card.title}
            content={card.content}
            image={card.image}
            size={card.size}
            actions={card.actions}
            orientation={iOrientation.Landscape}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCard;
