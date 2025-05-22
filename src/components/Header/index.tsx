'use client';
import { JSX, useState, useRef, Suspense } from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaPhoneSquare,
  FaGithub,
  FaYoutube,
  FaBars,
  FaTimesCircle,
  FaHome,
  FaTicketAlt,
  FaQuestionCircle,
  FaBookOpen,
  FaSearch,
  FaEnvelope,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.css';
import { useGlobalContext } from '@/context/TopNavContext';
import { iTarget } from '@/components/Common/button';
import { UserButton } from '@stackframe/stack';

export interface iContact {
  type: 'email' | 'phone' | 'phoneSquare';
  value: string;
}

export interface iSocialLink {
  icon: JSX.Element;
  url: string;
}

export interface iNavItem {
  icon?: JSX.Element;
  label: string;
  href: string;
}

export interface iHeaderProps {
  contacts?: iContact[];
  socialLinks?: iSocialLink[];
  navItems?: iNavItem[];
  logoSrc: string;
  logoAlt: string;
}

const defaultLogoSrc = '/image/logo-long.jpg';
const defaultLogoAlt = 'Logo';

/**
 * HeaderContent component renders the header section of the application.
 *
 * @param {iHeaderProps} props - The properties for the header component.
 * @param {iContact[]} [props.contacts] - The contact information to display.
 * @param {iSocialLink[]} [props.socialLinks] - The social media links to display.
 * @param {iNavItem[]} [props.navItems] - The navigation items to display.
 * @param {string} props.logoSrc - The source URL for the logo image.
 * @param {string} props.logoAlt - The alt text for the logo image.
 * @returns {JSX.Element} The rendered header component.
 */
const HeaderContent: React.FC<iHeaderProps> = ({
  contacts,
  socialLinks,
  // navItems,
  logoSrc = defaultLogoSrc,
  logoAlt = defaultLogoAlt,
}) => {
  const [hideNav, setHideNav] = useState<boolean>(true);
  const [navLinks] = useState<iNavItem[]>([
    { icon: <FaHome />, label: 'Home', href: '/' },
    { icon: <FaTicketAlt />, label: 'Events', href: '/events' },
    { icon: <FaBookOpen />, label: 'About', href: '/about' },
    { icon: <FaQuestionCircle />, label: 'FAQs', href: '/faqs' },
  ]);

  const mainNavRef = useRef<HTMLDivElement>(null);
  const { isTopNavVisible } = useGlobalContext();

  const defaultContacts: iContact[] = [
    { type: 'email', value: 'info@onlyfriends.com' },
    { type: 'phone', value: '073 640 1213' },
    { type: 'phoneSquare', value: '073 564 0213' },
  ];

  const defaultSocialLinks: iSocialLink[] = [
    { icon: <FaFacebook />, url: 'https://www.facebook.com' },
    { icon: <FaTwitter />, url: 'https://www.twitter.com' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com' },
    { icon: <FaGithub />, url: 'https://www.github.com' },
    { icon: <FaYoutube />, url: 'https://www.youtube.com' },
  ];

  // replace with default if not exist
  contacts = contacts || defaultContacts;
  socialLinks = socialLinks || defaultSocialLinks;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openImageModal = (_data: { src: string; alt: string }) => {
    // Implement modal opening logic here
  };

  return (
    <header className={styles.header + ' slideInTop'}>
      <div
        ref={mainNavRef}
        className={`${styles.mainNav} ${!isTopNavVisible ? styles.dark : ''}`}
      >
        <button
          onBlur={() => setTimeout(() => setHideNav(true), 300)}
          onClick={() => setHideNav(!hideNav)}
          className={styles.toggleNav}
        >
          {hideNav ? <FaBars /> : <FaTimesCircle />}
        </button>
        <div className={styles.navLogo}>
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={200}
            height={50}
            onClick={() => openImageModal({ src: logoSrc, alt: logoAlt })}
          />
        </div>
        <div className={`${styles.navItems} ${hideNav ? styles.hide : ''}`}>
          {navLinks?.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className={styles.cartSearch}>
          <div className={styles.searchBox}>
            <input
              className={styles.search}
              placeholder="Looking for something?"
              type="search"
              name="search"
              id="search"
            />
            <FaSearch />
          </div>
        </div>
        <UserButton />
      </div>
      {isTopNavVisible && false && true && (
        <div className={styles.topNav}>
          <div className={styles.contacts}>
            {contacts?.map((contact, index) => (
              <div key={index} className={styles.contact}>
                {contact.type === 'email' && <FaEnvelope />}
                {contact.type === 'phone' && <FaPhone />}
                {contact.type === 'phoneSquare' && <FaPhoneSquare />}
                <span>{contact.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.socials}>
            {socialLinks?.map((social, index) => (
              <Link
                key={index}
                href={social.url}
                target={iTarget.Blank}
                rel="noopener noreferrer"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Header = (props: iHeaderProps) => (
  <Suspense fallback={<div>Loading...</div>}>
    <HeaderContent {...props} />
  </Suspense>
);

export default Header;
