'use client';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import ChatContainer from '@//messaging/components/container';

/**
 * Messaging component renders the messaging dashboard layout
 * with a chat container for organizers.
 */
const Messaging: React.FC = () => {
  return (
    <DashboardLayout type="organizer">
      <ChatContainer />
    </DashboardLayout>
  );
};

export default Messaging;
