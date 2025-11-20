/*
 * owner: Clyne@kupotech.com
 */
import { useEffect, useState, useRef } from 'react';
import { event } from '@/utils/event';

import { eventName } from '../config';

export const useResize = () => {
  const depthRef = useRef(null);
  const [direction, setDirection] = useState('');
  useEffect(() => {
    const handleReflow = ({ width, height }) => {
      if (depthRef.current?.reflow) {
        setDirection(width >= height ? 'x' : 'y');
        depthRef.current.reflow();
      }
    };
    event.on(eventName, handleReflow);
    return () => {
      event.off(eventName);
    };
  }, [depthRef.current, setDirection]);

  useEffect(() => {
    const node = document.querySelector('.depth-wrapper');
    if (node) {
      const { width, height } = node.getBoundingClientRect();
      setDirection(width >= height ? 'x' : 'y');
    }
  }, [setDirection]);
  return { depthRef, direction };
};
