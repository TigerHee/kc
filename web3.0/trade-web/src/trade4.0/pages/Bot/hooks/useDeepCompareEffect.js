/**
 * Owner: mike@kupotech.com
 */
import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export default (callback, relays) => {
  const prev = useRef(relays);
  const changer = useRef({});
  if (!isEqual(relays, prev.current)) {
    prev.current = relays;
    changer.current = {};
  }
  useEffect(callback, [changer.current]);
};
