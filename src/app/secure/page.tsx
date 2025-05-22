import React from 'react';

import styles from './organizer.module.css';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

const OrganizerDashboard: React.FC = () => {
  return (
    <DashboardLayout type="admin">
      <div className={styles.dashboard} />
    </DashboardLayout>
  );
};

export default OrganizerDashboard;
