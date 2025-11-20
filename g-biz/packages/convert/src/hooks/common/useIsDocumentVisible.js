/*
 * @owner: borden@kupotech.com
 */
import { useState, useEffect } from 'react';

const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const getVisible = () => {
  if (!isBrowser) {
    return true;
  }
  return document.visibilityState !== 'hidden';
};

function useIsDocumentVisible() {
  const [isDocumentVisible, setIsDocumentVisible] = useState();

  useEffect(() => {
    const handle = () => {
      setIsDocumentVisible(getVisible());
    };
    document.addEventListener('visibilitychange', handle);
    return () => {
      document.removeEventListener('visibilitychange', handle);
    };
  }, []);

  return isDocumentVisible;
}

export default useIsDocumentVisible;
