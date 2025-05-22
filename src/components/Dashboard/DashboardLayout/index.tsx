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

interface iDashboardLayoutProps {
  children: ReactNode;
  type?: 'user' | 'organizer' | 'admin';
}

const linksMap = {
  admin: [
    {
      href: '/organizers',
      icon: FaUser,
      label: 'Organizers',
      disabled: true,
    },
    {
      href: '/applications',
      icon: FaWpforms,
      label: 'Applications',
    },
    { href: '/venues', icon: FaPlaceOfWorship, label: 'Venues' },
    { href: '/users', icon: FaUser, label: 'Users' },
    {
      href: '/insights',
      icon: MdOutlineAnalytics,
      label: 'Data Insights',
    },
    { href: '/emails', icon: MdOutlineEmail, label: 'System Emails' },
    { href: '/messaging', icon: FaMessage, label: 'Messaging' },
    { href: '/promo', icon: MdDiscount, label: 'Promo Codes' },
    {
      href: '/access-codes',
      icon: SiOpenaccess,
      label: 'Access Codes',
    },
    {
      href: '/reviews',
      icon: FaCalendarAlt,
      label: 'Reviews',
      disabled: true,
    },
    {
      href: '/issues',
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
    </Suspense>
  );
};

export default DashboardLayout;
