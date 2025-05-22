'use client';
import React, { useState } from 'react';
import styles from './pagination.module.css';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import Actions from '@/components/Common/Actions';
import { iSize, iVariant } from '@/lib/types';
import Select from '../Common/select';
import { useGlobalContext } from '@/context/TopNavContext';

interface iPaginationProps {
  currentPage: number;
  totalItems: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageClick: (page: number) => void;
  changeItemsPerPage?: (itemsPerPage: number) => void;
}

/**
 * Pagination component to handle the display of paginated data.
 *
 * @param {number} currentPage - The current active page.
 * @param {number} totalItems - The total number of items to paginate.
 */
/** */
const Pagination: React.FC<iPaginationProps> = ({
  currentPage,
  totalItems,
  onNextPage,
  onPrevPage,
  onPageClick,
  changeItemsPerPage,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { isMobile } = useGlobalContext();

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    if (changeItemsPerPage) changeItemsPerPage(Number(event.target.value));
  };

  return (
    <div className={styles.pagination}>
      <Actions
        actions={[
          {
            label: 'Prev',
            click: onPrevPage,
            disabled: currentPage === 1,
            variant:
              currentPage === 1 ? iVariant.Secondary : iVariant.Quaternary,
            size: iSize.Small,
            iconStart: <FaCaretLeft />,
          },
          {
            label: 'Next',
            click: onNextPage,
            disabled: currentPage === totalPages,
            variant:
              currentPage === totalPages
                ? iVariant.Secondary
                : iVariant.Quaternary,
            size: iSize.Small,
            iconEnd: <FaCaretRight />,
          },
        ]}
      />
      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className={`${styles.page} ${
              currentPage === index + 1 ? styles.active : ''
            }`}
            role="button"
            onClick={() => onPageClick(index + 1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onPageClick(index + 1);
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div className={styles.itemsPerPage}>
        {!isMobile && <label htmlFor="itemsPerPage">Items per page:</label>}
        <Select
          value={itemsPerPage}
          handleSelectChange={handleItemsPerPageChange}
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
          ]}
        />
      </div>
    </div>
  );
};

export default Pagination;
