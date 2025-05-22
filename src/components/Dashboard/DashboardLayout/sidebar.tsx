import Link from 'next/link';
import styles from './userDashLayout.module.css';
import Divider from '@/components/Divider';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { ReactNode } from 'react';

const Sidebar: React.FC<{
  links: Array<{
    href: string;
    icon: React.ElementType;
    label: string;
    disabled?: boolean; // Add disabled property
  }>;
  children?: ReactNode;
  isVisible: boolean;
}> = ({ links, children, isVisible }) => (
  <aside
    className={`${styles.sidebar} ${isVisible ? styles.sidebarVisible : ''}`}
  >
    <nav>
      <div className={styles.top}>
        {links.map(({ href, icon: Icon, label, disabled }) => (
          <div
            key={href}
            className={`${styles.linkWrapper} ${
              disabled ? styles.disabledLink : ''
            }`}
          >
            {disabled ? (
              <div className={styles.disabledLinkContent}>
                <div className={styles.iconText}>
                  <Icon />
                  <span>{label}</span>
                </div>
                <span className={styles.comingSoonPill}>Coming Soon</span>
              </div>
            ) : (
              <Link href={href}>
                <Icon /> <span>{label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        {children}
        <Divider />
        <Link href="/auth-ext/account-settings">
          <FaCog /> <span>Settings</span>
        </Link>
        <Link href="/auth-ext/logout">
          <FaSignOutAlt /> <span>Logout</span>
        </Link>
      </div>
    </nav>
  </aside>
);

export default Sidebar;
