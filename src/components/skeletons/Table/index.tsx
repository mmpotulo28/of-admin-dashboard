import React from 'react';
import { Skeleton } from '@/components/skeleton';
import styles from './TableSkeleton.module.css';
import { LoaderIcon } from 'react-hot-toast';

interface TableSkeletonProps {
  rows: number;
  columns: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows, columns }) => {
  const renderSkeletonRow = (key: number) => (
    <tr key={`skeleton-${key}`}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={`skeleton-cell-${index}`} className={styles.skeletonCell}>
          <Skeleton />
        </td>
      ))}
    </tr>
  );

  return (
    <table>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th
              key={`skeleton-header-${index}`}
              className={styles.skeletonHeader}
            >
              <div className={styles.loading}>
                <LoaderIcon /> Loading...
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) =>
          renderSkeletonRow(index)
        )}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
