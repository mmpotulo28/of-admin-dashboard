import QRCode from 'react-qr-code';
import styles from '../event-ticket.module.css';
import Image from 'next/image';
import { iDetailedTicket } from '@/lib/types';

const TicketRight: React.FC<{
  ticket: iDetailedTicket;
  handleQrClick: () => void;
}> = ({ ticket, handleQrClick }) => (
  <div className={styles.right}>
    <p className={styles.admitOne}>
      {[0, 1, 2].map(() => (
        <span key={ticket.type.name}>{ticket.type.name}</span>
      ))}
    </p>
    <div className={styles.rightInfoContainer}>
      <div className={styles.logo} />
      <Image src={'/image/logo-long.jpg'} alt={''} width={150} height={35} />
      <div className={styles.qrCode}>
        <QRCode
          value="https://www.google.com"
          size={100}
          onClick={handleQrClick}
        />
        <span>click to enlarge</span>
      </div>
    </div>
    <div className={styles.ticketNumber}>#2003022{ticket.id}</div>
  </div>
);

export default TicketRight;
