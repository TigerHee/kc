import {useDebounceFn} from 'ahooks';
import {useState} from 'react';

const DEFAULT_WAIT = 300;

const useScrollListener = (onCustomScroll, wait = DEFAULT_WAIT) => {
  const [scrollY, setScrollY] = useState(0);

  const {run: onScroll} = useDebounceFn(
    event => {
      // 更新滚动位置的state
      setScrollY(event?.nativeEvent?.contentOffset?.y);

      // 调用用户自定义的滚动事件处理函数
      if (onCustomScroll) {
        onCustomScroll(event);
      }
    },
    {
      wait,
    },
  );

  return {scrollY, onScroll};
};

export default useScrollListener;
