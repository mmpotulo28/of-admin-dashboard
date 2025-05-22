'use client';
import React, { useEffect, useState, Suspense } from 'react';
import styles from './footer.module.css';
import Divider from '../Divider';
import Link from 'next/link';
import Input from '../Common/input';
import Actions from '../Common/Actions';
import { iButtonType } from '../Common/button';
import { CgPushChevronDown } from 'react-icons/cg';
import { iFooter, iSize } from '@/lib/types';
import { getContentType } from '@/lib/contentful';

const Footer = () => {
  const [footerData, setFooterData] = useState<iFooter | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      const data = await getContentType('footer');
      setFooterData(data);
    };

    fetchFooterData();
  }, [footerData]);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.newsletter}>
          <div className={styles.content}>
            <h2 className={styles.newsletterTitle}>
              {footerData?.subscribeTitle}
            </h2>
            <p className={styles.newsletterDescription}>
              {footerData?.subscribeDescription}
            </p>
          </div>
          <div className={styles.actions}>
            <div className={styles.form}>
              <Suspense fallback={<div>Loading...</div>}>
                <Input
                  className={styles.input}
                  type="email"
                  placeholder="Your email here"
                  label="Your email here"
                />
              </Suspense>
              <Actions
                actions={[
                  {
                    label: 'Subscribe',
                    iconEnd: <CgPushChevronDown />,
                    type: iButtonType.Submit,
                    size: iSize.Medium,
                  },
                ]}
              />
            </div>
            <p className={styles.privacyText}>
              By subscribing, you accept our{' '}
              <Link href={footerData?.privacyPolicyLink || ''}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        <Divider />
        <div className={styles.links}>
          {footerData?.links &&
            Object.keys(footerData.links)?.map((group) => (
              <div key={group} className={styles.linkGroup}>
                <h3 className={styles.linkGroupTitle}>{group}</h3>
                <ul>
                  {Array.isArray(footerData.links[group]) &&
                    footerData.links[group]?.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>
        <Divider />
        <div className={styles.footerBottom}>
          {footerData?.copyright && footerData.copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
