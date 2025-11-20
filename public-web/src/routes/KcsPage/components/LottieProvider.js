/**
 * Owner: chris@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';
import { lottieStore } from '../utils';

/*
 * segments Array 某一段循环播放
 */
const LottieProvider = ({
  iconName,
  className,
  speed,
  loop = true,
  segments,
  useCache = false,
}) => {
  const domRef = useRef(null);
  const [instance, setInstance] = useState(null);
  const instanceRef = useRef();
  useEffect(() => {
    if (!iconName) return;
    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    const loadAnimation = (data) => {
      import('lottie-web').then((Lottie) => {
        const instance = Lottie.loadAnimation({
          container: domRef.current,
          renderer: 'svg',
          loop,
          autoplay: true,
          animationData: data,
        });
        instanceRef.current = instance;
        if (Array.isArray(segments)) {
          instance.playSegments(segments, false);
        }
        setInstance(instance);
      });
    };

    if (lottieStore[iconName]) {
      loadAnimation(lottieStore[iconName]);
      return;
    }
  }, [iconName, loop, segments, useCache]);

  useEffect(() => {
    if (instance && speed) instance.setSpeed(speed);
  }, [speed, instance]);

  return <div ref={domRef} className={className} />;
};

export default LottieProvider;
