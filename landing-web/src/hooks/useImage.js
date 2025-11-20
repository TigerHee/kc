/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useState } from 'react';

/**
 * 获取图片加载状态
 * @param {string} src : 图片地址;
 * @returns {{hasLoaded: boolean,hasError: boolean,hasStartedInitialFetch: boolean}}
 */
const useImage = (src = '') => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasStartedInitialFetch, setHasStartedInitialFetch] = useState(false);

  useEffect(
    () => {
      setHasStartedInitialFetch(true);
      setHasLoaded(false);
      setHasError(false);

      // image will not load twice
      const image = new Image();
      image.src = src;

      const handleError = () => {
        setHasError(true);
      };

      const handleLoad = () => {
        setHasLoaded(true);
        setHasError(false);
      };

      image.onerror = handleError;
      image.onload = handleLoad;

      return () => {
        image.removeEventListener('error', handleError);
        image.removeEventListener('load', handleLoad);
      };
    },
    [src],
  );

  return {
    hasLoaded,
    hasError,
    hasStartedInitialFetch,
  };
};

export default useImage;
