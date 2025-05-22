'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { debounce } from '@/lib/helpers';

/**
 * Custom hook that sets up an IntersectionObserver to monitor the visibility of a referenced element.
 *
 * @param {IntersectionObserverInit} options - Configuration options for the IntersectionObserver.
 * @param {number} debounceDelay - Delay in milliseconds to debounce the observer callback.
 *
 * @returns {Object} - An object containing:
 *   - `elementRef` (React.RefObject<HTMLDivElement>): A ref to be attached to the element to be observed.
 *   - `isVisible` (boolean): A state indicating whether the element is currently visible in the viewport.
 */
const useIntersectionObserver = (
  options: IntersectionObserverInit = {} as IntersectionObserverInit,
  debounceDelay = 0
) => {
  const elementRef = useRef<null | HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      debounce(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      }, debounceDelay)();
    },
    [debounceDelay]
  );

  const observerOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [observerCallback, observerOptions]);

  return { elementRef, isVisible };
};

export default useIntersectionObserver;
