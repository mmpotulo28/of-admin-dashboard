import styles from './eventBanner.module.css';
import { FaTag } from 'react-icons/fa';
import { FaArrowDownLong } from 'react-icons/fa6';
import Actions from '@/components/Common/Actions';
import Button, { iButtonType } from '@/components/Common/button';
import LockUp from '@/components/Common/lockup';
import { iFullEvent, iSize } from '@/lib/types';

/**
 * DetailsLeft component displays the left section of the event details.
 *
 * @param {Object} props - The props for the component.
 * @param {iFullEvent} props.event - The event data to display.
 */
export const DetailsLeft: React.FC<{ event: iFullEvent }> = ({ event }) => (
  <div className={styles.detailsLeft}>
    <LockUp title={event.title} subtitle={event.subtitle} size={iSize.Large} />
    {/* scroll down button */}
    <div className={styles.scrollDown}>
      <Button
        type={iButtonType.Icon}
        size={iSize.Large}
        iconEnd={<FaArrowDownLong />}
      />
    </div>
    <Actions
      actions={[
        ...event?.tags?.map((tag: string) => ({
          label: tag,
          size: iSize.Small,
          iconEnd: <FaTag />,
        })),
        {
          label: event.category,
          size: iSize.Small,
          iconEnd: <FaTag />,
        },
      ]}
    />
  </div>
);

/**
 * DetailsRight component displays the right section of the event details.
 *
 * @param {Object} props - The props for the component.
 * @param {iFullEvent} props.event - The event data to display.
 */
export const DetailsRight: React.FC<{ event: iFullEvent }> = ({ event }) => (
  <div className={styles.detailsRight}>
    <LockUp
      title="Organizer"
      subtitle={event.organiser.name}
      size={iSize.Small}
    />
    <LockUp
      title="Date"
      subtitle={new Date(event?.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
      size={iSize.Small}
    />
    <LockUp title="Location" subtitle={event.location} size={iSize.Small} />
    <LockUp
      title="Website"
      subtitle={'https://onlyfriendsent.com'}
      size={iSize.Small}
    />
  </div>
);
