/**
 * Owner: willen@kupotech.com
 */
import Lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

const LottieProvider = ({ iconName, className, speed, loop = true }) => {
  const domRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    if (!iconName) return;
    let instance = null;

    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    let isMounted = true;

    // 使用animationData而非path，以兼容safari无法加载的问题
    fetch(`${__webpack_public_path__}${DEPLOY_PATH}/static/lottie/${iconName}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        instance = Lottie.loadAnimation({
          container: domRef.current,
          renderer: 'svg',
          loop,
          autoplay: true,
          animationData: data,
        });

        if (speed) {
          instance.setSpeed(speed);
        }

        instanceRef.current = instance;
      });
    return () => {
      // 修复切换主题色后会重复追加 动态Icon问题
      isMounted = false;
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [iconName]);

  useEffect(() => {
    if (speed) instanceRef.current?.setSpeed?.(speed);
  }, [speed]);

  useEffect(() => {
    instanceRef.current?.setLoop?.(loop);
  }, [loop]);

  return (
    <div
      ref={domRef}
      className={className}
      data-inspector="inspector_signup_gift_button"
      data-name={iconName}
    />
  );
};

export default LottieProvider;
