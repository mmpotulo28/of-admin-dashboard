'use client';
import React, { useRef } from 'react';
import styles from './events.module.css';
import { FaCaretLeft, FaCaretRight, FaSearch } from 'react-icons/fa';
import Button from '@/components/Common/button';
import { iSize, iVariant } from '@/lib/types';
import {
  handleScrollLeft,
  handleScrollRight,
  handleSortChange,
  handleSortDirectionChange,
} from './utils';
import { FaArrowUpShortWide, FaArrowUpWideShort } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import { useEventsContext } from '@/context/EventsContext';

interface ControlsProps {
  sortCriteria: string;
  setSortCriteria: React.Dispatch<React.SetStateAction<string>>;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Controls: React.FC<ControlsProps> = ({
  setSortCriteria,
  sortCriteria,
  sortDirection,
  setSortDirection,
  setCurrentPage,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const { filters, setFilters, categories } = useEventsContext();

  const handleCategoryChange = (category: string) => {
    setFilters({ category });
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ searchQuery: e.target.value });
    setCurrentPage(1);
  };

  return (
    <div className={styles.controls}>
      {/* tabs */}
      <div className={styles.tabsContainer}>
        <span className={styles.left} onClick={() => handleScrollLeft(tabsRef)}>
          <FaCaretLeft />
        </span>
        <div className={styles.tabs} ref={tabsRef}>
          {['', ...categories].map((category) => (
            <Button
              key={category}
              label={category == '' ? 'All' : category}
              size={iSize.Small}
              variant={iVariant.Secondary}
              iconStart={filters.category === category && <MdVerified />}
              click={() =>
                handleCategoryChange(category === 'All' ? '' : category)
              }
            />
          ))}
        </div>
        <span
          className={styles.right}
          onClick={() => handleScrollRight(tabsRef)}
        >
          <FaCaretRight />
        </span>
      </div>
      <div className={styles.rightControls}>
        {/* sorting */}
        <div className={styles.sortingContainer}>
          <div className={styles.sorting}>
            <span>Sort by:</span>
            <select
              value={sortCriteria}
              onChange={(e) =>
                handleSortChange(e.target.value, setSortCriteria)
              }
            >
              <option value="date">Date</option>
              <option value="location">Location</option>
              <option value="category">Category</option>
            </select>
          </div>
          {/* sort direction */}
          <div className={styles.sortDirection}>
            <button onClick={() => handleSortDirectionChange(setSortDirection)}>
              {sortDirection === 'asc' ? (
                <FaArrowUpShortWide />
              ) : (
                <FaArrowUpWideShort />
              )}
            </button>
          </div>
        </div>
        {/* search */}
        <div className={styles.searchBox}>
          <input
            className={styles.search}
            placeholder="Search by title"
            type="search"
            name="search"
            id="search"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
          <span>
            <FaSearch />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
