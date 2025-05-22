import { JSX } from 'react';
import styles from './pricing.module.css';
import LockUp from '@/components/Common/lockup';
import { iFullEvent, iSize, iTheme } from '@/lib/types';
import Container from '../Container';
import Divider from '../Divider';
import Actions from '@/components/Common/Actions';
import { FaCheck } from 'react-icons/fa6';
import { scrollToElement } from '@/lib/helpers';

interface PricingOptionsProps {
  eventDetails: iFullEvent;
}

/**
 * PricingOptions component displays ticket pricing options for an event.
 *
 * @param {PricingOptionsProps} props - The props containing event details.
 * @returns {JSX.Element | null} The rendered component or null if no ticket details are available.
 */
const PricingOptions: React.FC<PricingOptionsProps> = ({
  eventDetails,
}: PricingOptionsProps): JSX.Element | null => {
  if (!eventDetails || !eventDetails.ticketTypes) {
    return null; // or some fallback UI
  }

  const { ticketTypes } = eventDetails;

  return (
    <Container>
      <div id="ticketOptions" className={styles.pricingOptions}>
        <LockUp
          title="Ticket Pricing Options"
          overline="Affordable"
          subtitle="Choose the best ticket that suits your needs."
          size={iSize.Large}
          theme={iTheme.Dark}
          centered
        />

        <div className={styles.pricingContainer}>
          {ticketTypes && eventDetails.ticketTypes.length > 0 ? (
            ticketTypes?.map((option) => (
              <div key={option.name} className={styles.pricingCard}>
                {/* top section */}
                <div className={styles.header}>
                  <LockUp
                    title={option.name}
                    subtitle={option.description}
                    theme={iTheme.Dark}
                  />
                  <h1>{option.price === 0 ? 'Free' : `R${option.price}`}</h1>
                </div>
                <Divider theme={iTheme.Dark} />

                <div className={styles.body}>
                  <div className={styles.features}>
                    {option?.features?.map((feature) => (
                      <span key={feature}>
                        <FaCheck className={styles.icon} />
                        <li>{feature.trim()}</li>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.controls}>
                  <Actions
                    fullWidth
                    actions={[
                      {
                        disabled: option.availability === 0,
                        label: 'Choose Ticket',
                        click: () => {
                          scrollToElement('eventDetails');
                        },
                      },
                    ]}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No pricing options available.</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PricingOptions;
