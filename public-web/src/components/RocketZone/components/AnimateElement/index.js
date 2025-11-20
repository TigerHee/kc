/**
 * Owner: solar@kupotech.com
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const AnimateElement = ({ load = () => {}, className, speed, loop = true }) => {
  const domRef = useRef(null);
  const [instance, setInstance] = useState(null);
  const instanceRef = useRef(false);
  const _load = useCallback(load, [load]);

  useEffect(() => {
    if (!instanceRef.current) {
      instanceRef.current = true;
      Promise.all([import('lottie-web'), _load()]).then(([Lottie, data]) => {
        const lottieInstance = Lottie.loadAnimation({
          container: domRef.current,
          renderer: 'svg',
          loop,
          autoplay: true,
          animationData: data,
        });
        setInstance(lottieInstance);
      });
    }
  }, [_load, loop]);

  useEffect(() => {
    if (instance && speed) {
      instance.setSpeed(speed);
    }
  }, [speed, instance]);
  return <div ref={domRef} className={className} />;
};

export default AnimateElement;
