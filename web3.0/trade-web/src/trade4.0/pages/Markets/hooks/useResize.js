/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-24 17:39:40
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-29 15:45:53
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/hooks/useResize.js
 * @Description:
 */
import { useEffect, useState, useRef } from 'react';
import { event } from '@/utils/event';

import { eventName } from '../config';

export const useResize = () => {
  const [size, setSize] = useState('');
  useEffect(() => {

      const handleReflow = ({ width, height }) => {
        // marketsRef.current.reflow();
        setSize({ width, height });
      };
      event.on(eventName, handleReflow);
      return () => {
        event.off(eventName);
      };

  }, [size]);

  return size;
};
