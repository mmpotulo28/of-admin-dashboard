'use client';
import { useEffect, ReactNode, useCallback, useState, Suspense } from 'react';
import { useGlobalContext } from '@/context/TopNavContext';
import styles from './userDashLayout.module.css';
import { FaCalendarAlt, FaCog, FaUser, FaWpforms } from 'react-icons/fa';
import { FaMessage, FaPlaceOfWorship } from 'react-icons/fa6';
import { SiOpenaccess } from 'react-icons/si';
import Sidebar from './sidebar';
import {
  MdDiscount,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineAnalytics,
  MdOutlineEmail,
} from 'react-icons/md';
import DashboardSkeleton from '@/components/skeletons/dashboard/DashboardSkeleton';
import MainSkeleton from '@/components/skeletons/dashboard/MainSkeleton';
import Header from '@/components/Header';
import { AccessControlProvider } from '@/context/AccessControlContext';

interface iDashboardLayoutProps {
  children: ReactNode;
  type?: 'user' | 'organizer' | 'admin';
}

const linksMap = {
  admin: [
    {
      href: '/secure/organizers',
      icon: FaUser,
      label: 'Organizers',
      disabled: true,
    },
    {
      href: '/secure/applications',
      icon: FaWpforms,
      label: 'Applications',
    },
    { href: '/secure/venues', icon: FaPlaceOfWorship, label: 'Venues' },
    { href: '/secure/users', icon: FaUser, label: 'Users' },
    {
      href: '/secure/insights',
      icon: MdOutlineAnalytics,
      label: 'Data Insights',
    },
    { href: '/secure/emails', icon: MdOutlineEmail, label: 'System Emails' },
    { href: '/secure/messaging', icon: FaMessage, label: 'Messaging' },
    { href: '/secure/promo', icon: MdDiscount, label: 'Promo Codes' },
    {
      href: '/secure/access-codes',
      icon: SiOpenaccess,
      label: 'Access Codes',
    },
    {
      href: '/secure/reviews',
      icon: FaCalendarAlt,
      label: 'Reviews',
      disabled: true,
    },
    {
      href: '/secure/issues',
      icon: FaCog,
      label: 'Issues',
      disabled: true,
    },
  ],
};

const DashboardLayout: React.FC<iDashboardLayoutProps> = ({ children }) => {
  const { isMobile } = useGlobalContext();
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const { setTopNavVisible } = useGlobalContext();

  const setTopNavVisibleCallback = useCallback(
    (visible: boolean) => {
      setTopNavVisible(visible);
    },
    [setTopNavVisible]
  );

  useEffect(() => {
    setTopNavVisibleCallback(false);
    return () => setTopNavVisibleCallback(true);
  }, [setTopNavVisibleCallback]);

  const links = linksMap.admin;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AccessControlProvider>
        <section
          className={`${styles.userDashLayout} ${
            isSidebarVisible ? '' : styles.sidebarHidden
          }`}
        >
          <Sidebar links={links} isVisible={isSidebarVisible}>
            <button
              className={styles.toggleBtn}
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              {isSidebarVisible ? (
                <MdKeyboardDoubleArrowLeft />
              ) : (
                <MdKeyboardDoubleArrowRight />
              )}
            </button>
          </Sidebar>
          <Suspense fallback={<MainSkeleton />}>
            <main className={styles.mainContent}>
              <Header
                logoSrc={'/image/logo-long.jpg'}
                logoAlt={'OnlyFriends Logo'}
              />
              {children}
            </main>
          </Suspense>
        </section>
      </AccessControlProvider>
    </Suspense>
  );
};

export default DashboardLayout;
