/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

const LottieProvider = ({ lottieJson, className, speed, loop = true }) => {
  const domRef = useRef(null);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!lottieJson) return;
    // 使用animationData而非path，以兼容safari无法加载的问题
    const lottieInstance = lottie.loadAnimation({
      loop,
      container: domRef.current,
      renderer: 'svg',
      autoplay: true,
      animationData: lottieJson,
    });
    setInstance(lottieInstance);

    return () => {
      if (lottieInstance) {
        lottieInstance.destroy();
      }
    };
  }, [lottieJson, loop]);

  useEffect(() => {
    if (instance && speed) {
      instance.setSpeed(speed);
    }
  }, [speed, instance]);

  return <div ref={domRef} className={className} />;
};

export default LottieProvider;
