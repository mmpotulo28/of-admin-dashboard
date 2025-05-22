import React from 'react';
import styles from './event-ticket.module.css';
import TicketLeft from './components/TicketLeft';
import TicketInfo from './components/TicketInfo';
import TicketRight from './components/TicketRight';
import { iDetailedTicket } from '@/lib/types';

export interface iEventTicketProps {
  ticket?: iDetailedTicket | null;
  handleQrClick: () => void;
  ticketRef: React.RefObject<HTMLDivElement | null>;
}

const EventTicket: React.FC<iEventTicketProps> = ({
  ticket,
  handleQrClick,
  ticketRef,
}) => {
  if (!ticket)
    return <div className={styles.ticketContainer}>Ticket Not Found</div>;

  return (
    <div className={styles.shadow}>
      <div className={styles.ticketContainer} ref={ticketRef}>
        <TicketLeft ticket={ticket} />
        <TicketInfo ticket={ticket} />
        <TicketRight ticket={ticket} handleQrClick={handleQrClick} />
      </div>
    </div>
  );
};

export default EventTicket;
