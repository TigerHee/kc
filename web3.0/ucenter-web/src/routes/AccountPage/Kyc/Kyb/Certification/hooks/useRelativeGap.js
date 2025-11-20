/**
 * Owner: vijay.zhou@kupotech.com
 * 计算子元素在父元素里的相对位置
 */
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

const useRelativeGap = ({ disabled = false }) => {
  const targetRef = useRef();
  const parentRef = useRef();
  const [gap, setGap] = useState(0);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleResize = debounce(
      () => {
        const targetPos = targetRef.current?.getBoundingClientRect() ?? { top: 0 };
        const parentPos = parentRef.current?.getBoundingClientRect() ?? { top: 0 };
        setGap(Math.abs(parentPos.top - targetPos.top));
      },
      16,
      { leading: false, trailing: true },
    );
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
    };
  }, [disabled]);

  return { targetRef, parentRef, gap };
};

export default useRelativeGap;
