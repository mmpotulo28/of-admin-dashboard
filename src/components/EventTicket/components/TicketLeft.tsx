import { iDetailedTicket } from '@/lib/types';
import styles from '../event-ticket.module.css';

const TicketLeft: React.FC<{ ticket: iDetailedTicket }> = ({ ticket }) => (
  <div className={styles.left}>
    <div
      className={styles.image}
      style={{
        backgroundImage:
          'url("/image/0e3ab950-3e29-4087-bfbb-9204f2aa07f8.jpg")',
      }}
    />
    <div>
      <p className={styles.admitOne}>
        {[0, 1, 2].map(() => (
          <span key={ticket.type.name}>{ticket.type.name}</span>
        ))}
      </p>
      <div className={styles.ticketNumber}>
        <p>#20030221{ticket.id}</p>
      </div>
    </div>
  </div>
);

export default TicketLeft;
