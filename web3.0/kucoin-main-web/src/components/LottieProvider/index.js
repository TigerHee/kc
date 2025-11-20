/**
 * Owner: melon@kupotech.com
 */
import { debounce } from 'lodash';
import lottie from 'lottie-web';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const noop = () => {};
const defaultOptions = {};

const LottieProvider = forwardRef(
  (
    {
      lottieJson,
      className,
      speed,
      loop = true,
      options = defaultOptions,
      renderer = 'svg',
      readyToPlay = noop,
      ...rest
    },
    ref,
  ) => {
    const domRef = useRef(null);
    const [instance, setInstance] = useState(null);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          lottie.play();
        },
      }),
      [instance],
    );

    useEffect(() => {
      if (!lottieJson) return;
      // 使用animationData而非path，以兼容safari无法加载的问题å
      const instance = lottie.loadAnimation({
        loop,
        container: domRef.current,
        renderer,
        autoplay: true,
        animationData: lottieJson,
        ...options,
      });
      setInstance(instance);

      const onLoaded = debounce(
        () => {
          readyToPlay && readyToPlay(instance);
        },
        300,
        { leading: false, trailing: true },
      );

      instance.addEventListener('DOMLoaded', onLoaded);
      return () => {
        instance && instance.destroy();
      };
    }, [lottieJson, loop, options, readyToPlay]);

    useEffect(() => {
      if (instance && speed) {
        instance.setSpeed(speed);
      }
    }, [speed, instance]);

    return <div ref={domRef} className={className} {...rest} />;
  },
);

export default LottieProvider;
