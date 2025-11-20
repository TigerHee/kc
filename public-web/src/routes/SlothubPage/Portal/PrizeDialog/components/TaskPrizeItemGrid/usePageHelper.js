/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-14 17:37:59
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-14 18:25:51
 */
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { useMemo, useRef, useState } from 'react';

// 单个页面的宽度
const SINGLE_PAGE_WIDTH = 400;

const usePageHelper = (groups) => {
  const [current, setCurrent] = useState(0);
  const carouselWrapRef = useRef(null);

  const isLeftEnd = useMemo(() => current === 0, [current]);
  const isRightEnd = useMemo(() => current === groups.length - 1, [current, groups.length]);

  const handleScrollByPage = useMemoizedFn((targetPage) => {
    if (!carouselWrapRef.current) return;
    carouselWrapRef.current.scrollTo({
      top: 0,
      left: targetPage * SINGLE_PAGE_WIDTH,
      behavior: 'smooth',
    });
  });

  const { run: handleNextPage } = useDebounceFn(
    () => {
      if (isRightEnd) return;
      const target = current + 1;
      setCurrent(target);
      handleScrollByPage(target);
    },
    {
      wait: 300,
      leading: true,
      trailing: false,
    },
  );

  const { run: handleLastPage } = useDebounceFn(
    () => {
      if (isLeftEnd) return;
      const target = current - 1;
      setCurrent(target);
      handleScrollByPage(target);
    },
    {
      wait: 300,
      leading: true,
      trailing: false,
    },
  );

  return {
    current,
    setCurrent,
    handleNextPage,
    handleLastPage,
    isLeftEnd,
    isRightEnd,
    carouselWrapRef,
  };
};

export default usePageHelper;
