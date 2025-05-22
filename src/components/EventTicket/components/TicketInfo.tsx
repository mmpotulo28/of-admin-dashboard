import { FaCertificate, FaEnvelope } from 'react-icons/fa';
import styles from '../event-ticket.module.css';

import { FaMapLocation } from 'react-icons/fa6';
import { iDetailedTicket } from '@/lib/types';

const TicketInfo: React.FC<{ ticket: iDetailedTicket }> = ({ ticket }) => (
  <div className={styles.ticketInfo}>
    {ticket.type.name === 'VIP' && (
      <FaCertificate className={styles.vipBadge} />
    )}
    <p className={styles.date}>
      <span>
        {new Date(ticket.event.date)
          .toLocaleDateString('en-US', { weekday: 'long' })
          .toUpperCase()}
      </span>
      <span className={styles.june29}>
        {new Date(ticket.event.date)
          .toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
          .toUpperCase()}
      </span>
      <span>{new Date(ticket.event.date).getFullYear()}</span>
    </p>
    <div className={styles.showName}>
      <h1>{ticket.event.title}</h1>
      <h2>{ticket.owner.name}</h2>
    </div>
    <div className={`${styles.time} ${styles.small}`}>
      <p>
        {new Date(
          ticket.event.date + 'T' + ticket.event.startTime
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}{' '}
        <span>to</span>{' '}
        {new Date(
          ticket.event.date + 'T' + ticket.event.endTime
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </p>
      <p>
        {ticket.type.name} <span>•</span> R{ticket.type.price.toFixed(2)}
      </p>
    </div>
    <p className={styles.location}>
      <span>
        <FaEnvelope /> {ticket.owner.email}
      </span>
      <span>
        <FaMapLocation /> {ticket.event.location}
      </span>
    </p>
  </div>
);

export default TicketInfo;
