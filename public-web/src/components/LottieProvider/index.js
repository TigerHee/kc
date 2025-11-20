/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-02 14:36:39
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-19 12:47:48
 * @FilePath: /public-web/src/components/LottieProvider/index.js
 * @Description:
 */
/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';

// 根据文件名缓存数据
let cache = {};

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

    if (useCache && cache[iconName]) {
      loadAnimation(cache[iconName]);
      return;
    }

    // 使用animationData而非path，以兼容safari无法加载的问题
    fetch(`${__webpack_public_path__}${DEPLOY_PATH}/static/lottie/${iconName}.json`).then(
      async (res) => {
        const data = await res.json();
        if (useCache) {
          cache[iconName] = data;
        }
        loadAnimation(data);
      },
    );
  }, [iconName, loop, segments, useCache]);

  useEffect(() => {
    if (instance && speed) instance.setSpeed(speed);
  }, [speed, instance]);

  return <div ref={domRef} className={className} />;
};

export default LottieProvider;
