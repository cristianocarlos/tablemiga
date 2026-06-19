import {useEffect, useState} from 'react';

import type {RefObject} from 'react';

export default function useInViewport(ref: RefObject<HTMLElement | null>, options = {}) {
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIn(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line @eslint-react/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIn;
}
