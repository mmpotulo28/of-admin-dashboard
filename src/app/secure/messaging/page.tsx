import { JSX } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import styles from './messaging.module.css';
import ChatContainer from './components/container';

export enum iUserType {
  user = 'user',
  organizer = 'org',
  admin = 'admin',
}

/**
 * Messaging component for the organizer dashboard.
 *
 * This component renders the messaging interface within the organizer's dashboard layout.
 * It includes a sidebar for event selection and a main messaging area.
 *
 * @returns {JSX.Element} The rendered Messaging component.
 */
const Messaging: React.FC = (): JSX.Element => {
  return (
    <DashboardLayout type="organizer">
      <div className={styles.container}>
        <ChatContainer />
      </div>
    </DashboardLayout>
  );
};

export default Messaging;
