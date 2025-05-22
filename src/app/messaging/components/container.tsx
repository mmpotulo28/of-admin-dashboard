'use client';

import styles from '../messaging.module.css';
import { useAccessControl } from '@/context/AccessControlContext';
import { MessagingProvider } from '@/context/MessagingContext';
import { Suspense } from 'react';
import { iUserType } from '../page';
import MessagingContent from './messaging';
import MessagingSidebar from './sidebar';

const ChatContainer: React.FC = () => {
  const { isAdmin, isOrganizer, isUser } = useAccessControl();
  let userType = iUserType.user;

  if (isAdmin) {
    userType = iUserType.admin;
  } else if (isOrganizer) {
    userType = iUserType.organizer;
  } else if (isUser) {
    userType = iUserType.user;
  }

  return (
    <div className={`${styles.chatContainer} ${styles[userType]}`}>
      <MessagingProvider>
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <MessagingSidebar />
        </Suspense>
        <Suspense fallback={<div>Loading messages...</div>}>
          <MessagingContent />
        </Suspense>
      </MessagingProvider>
    </div>
  );
};

export default ChatContainer;
