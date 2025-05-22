'use client';
import { useState, useEffect } from 'react';
import { FaAngleDoubleUp } from 'react-icons/fa';
import Button, { iButtonType } from '@/components/Common/button';
import styles from './stt.module.css';
import { iSize, iVariant } from '@/lib/types';
import { debounce } from '@/lib/helpers';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > window.innerHeight / 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const debouncedHandleScroll = debounce(handleScroll, 100);
      window.addEventListener('scroll', debouncedHandleScroll);
      return () => {
        window.removeEventListener('scroll', debouncedHandleScroll);
      };
    }
  }, []);

  return (
    <div className={styles.scrollToTop}>
      {isVisible && (
        <Button
          type={iButtonType.Icon}
          variant={iVariant.Secondary}
          size={iSize.Large}
          iconEnd={<FaAngleDoubleUp />}
          click={handleScrollToTop}
          aria-label="Scroll to top"
        />
      )}
    </div>
  );
};

export default ScrollToTop;
