import React from 'react';
import styles from './crumbs.module.css';
import { FaAngleRight } from 'react-icons/fa';
import Link from 'next/link';
import Container from '../Container';
import { iVariant } from '@/lib/types';
import { Breadcrumbs as Crumbs, BreadcrumbItem } from '@heroui/react';

interface BreadcrumbProps {
  breadcrumbs: { label: string; href: string }[];
  variant?: iVariant;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({
  breadcrumbs,
  variant = iVariant.Primary,
}) => {
  return (
    <Container padded={false}>
      {variant === iVariant.Primary ? (
        <nav aria-label="breadcrumb" className={styles.breadcrumbs}>
          <ul className={styles.breadcrumb}>
            {breadcrumbs?.map((breadcrumb, index) => (
              <li key={breadcrumb.href} className={styles.breadcrumbItem}>
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                    <FaAngleRight className={styles.crumbSeperator} />
                  </>
                ) : (
                  <> {breadcrumb.label}</>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <Crumbs className={styles.breadcrumbs}>
          {breadcrumbs?.map((breadcrumb) => (
            <BreadcrumbItem
              key={breadcrumb.href}
              href={breadcrumb.href}
              aria-label="breadcrumb"
            >
              {breadcrumb.label}
            </BreadcrumbItem>
          ))}
        </Crumbs>
      )}
    </Container>
  );
};

export default Breadcrumbs;
