import {useEffect, useRef} from 'react';

export const useDebugLog = value => {
  const times = useRef(0);
  useEffect(() => {
    let debug = setInterval(() => {
      console.log('mylog-value', JSON.stringify({value}));
      times.current = times.current + 1;
    }, 5000);

    return () => {
      clearInterval(debug);
    };
  }, [value]);
};
