import LockUp from '@/components/Common/lockup';
import ControlsSkeleton from '@/components/EventListing/ControlsSkeleton';
import PaginationSkeleton from '@/components/EventListing/PaginationSkeleton';
import { Skeleton } from '@/components/skeleton';
import TableSkeleton from '@/components/skeletons/Table';
import { iTheme, iSize, iLockUpProps, iVariant } from '@/lib/types';
import React from 'react';

export interface iDashSkeletonLoaderProps extends iLockUpProps {
  variant?: iVariant;
}

const DashSkeletonLoader: React.FC<iDashSkeletonLoaderProps> = ({
  title,
  overline,
  subtitle,
}) => {
  return (
    <>
      <ControlsSkeleton />
      <LockUp
        overline={overline}
        title={title}
        subtitle={subtitle}
        theme={iTheme.Dark}
        size={iSize.Large}
      />
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} />
      ))}
      <TableSkeleton rows={5} columns={6} />
      <PaginationSkeleton />
    </>
  );
};

export default DashSkeletonLoader;
