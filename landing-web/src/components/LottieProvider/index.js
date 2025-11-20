/**
 * Owner: tom@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

const LottieProvider = ({ lottieJson, style, className, speed, loop = true }) => {
  const domRef = useRef(null);
  const [instance, setInstance] = useState(null);

  useEffect(
    () => {
      if (!lottieJson) return;
      // 使用animationData而非path，以兼容safari无法加载的问题å
      const instance = lottie.loadAnimation({
        loop,
        container: domRef.current,
        renderer: 'svg',
        autoplay: true,
        animationData: lottieJson,
      });
      setInstance(instance);

      return () => {
        instance && instance.destroy();
      };
    },
    [lottieJson, loop],
  );

  useEffect(
    () => {
      if (instance && speed) {
        instance.setSpeed(speed);
      }
    },
    [speed, instance],
  );

  return <div ref={domRef} style={style} className={className} />;
};

export default LottieProvider;
