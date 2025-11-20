/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useRef, useEffect } from 'react';

/**
 * Beep
 */
const Beep = (props) => {
  const { src, onStop, ...restProps } = props;
  const audioRef = useRef();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && onStop) {
      audio.loop = false;
      audio.addEventListener('ended', onStop, false);
    }
    return () => {
      audio.removeEventListener('ended', onStop, false);
    };
  }, []);

  return <audio autoPlay ref={audioRef} src={src} {...restProps} />;
};

export default memo(Beep);
