'use client';
import React, { useState } from 'react';
import styles from './accordion.module.css';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import LockUp from '@/components/Common/lockup';
import Pagination from '../pagination';
import { iTheme } from '@/lib/types';

export interface iAccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
}

export interface iAccordionProps {
  id?: string;
  overline?: string;
  title?: string;
  subtitle?: string;
  topContent?: string;
  items: iAccordionItem[];
}

const Accordion: React.FC<iAccordionProps> = ({
  id,
  overline,
  title,
  subtitle,
  topContent,
  items = [],
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(items.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.accordion} id={id}>
      {title && (
        <LockUp
          theme={iTheme.Dark}
          title={title}
          overline={overline}
          subtitle={subtitle}
        />
      )}
      <p className={styles.topContent}>{topContent}</p>
      {paginatedItems?.map((item: iAccordionItem, index: number) => (
        <div
          key={item.id}
          className={`${styles['accordion-item']} ${
            activeIndex === index ? styles.active : ''
          }`}
        >
          <div
            className={styles['accordion-item-header']}
            onClick={() => handleItemClick(index)}
          >
            <div className={styles.left}>
              <h2>{item.title}</h2>
              {item.subtitle && <h3>{item.subtitle}</h3>}
            </div>
            <div className={styles.right}>
              {index === activeIndex ? <FaCaretUp /> : <FaCaretDown />}
            </div>
          </div>
          <div className={styles['accordion-item-content']}>
            <p>{item.content}</p>
          </div>
        </div>
      ))}
      {Math.ceil(items.length / itemsPerPage) > 1 && (
        <Pagination
          currentPage={currentPage}
          totalItems={items.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onPageClick={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Accordion;
