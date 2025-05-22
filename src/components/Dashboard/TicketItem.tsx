import React from 'react';
import styles from './dashboard.module.css';
import { MdOutlineOpenInNew, MdReportProblem } from 'react-icons/md';
import Actions from '@/components/Common/Actions';
import LockUp from '@/components/Common/lockup';
import { iDetailedTicket, iSize, iTheme, iVariant } from '@/lib/types';
import { iButtonType, iTarget } from '@/components/Common/button';

interface TicketItemProps {
  ticket: iDetailedTicket;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
  return (
    <div className={styles.ticket}>
      <div className={styles.ticketHeader}>
        <div className={styles.ticketInfo}>
          <LockUp
            overline={new Date(ticket.event.date).toLocaleDateString()}
            title={ticket.event.title}
            subtitle={ticket.type.name}
            theme={iTheme.Dark}
            size={iSize.Small}
          />
        </div>
      </div>
      <div className={styles.ticketActions}>
        <Actions
          fullWidth
          actions={[
            {
              label: 'View Ticket',
              iconEnd: <MdOutlineOpenInNew />,
              size: iSize.Small,
              variant: iVariant.Secondary,
              type: iButtonType.Link,
              url: {
                link: `/tickets?id=${ticket.id}`,
                target: iTarget.Blank,
              },
            },
            {
              label: 'Report Issue',
              iconEnd: <MdReportProblem />,
              size: iSize.Small,
              variant: iVariant.Tertiary,
              type: iButtonType.Link,
              url: {
                link: `/contact?subject=Ticket Issue&ticket=${ticket.id}`,
                target: iTarget.Blank,
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TicketItem;
