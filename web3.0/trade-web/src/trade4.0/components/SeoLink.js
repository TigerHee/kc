/*
 * @owner: borden@kupotech.com
 * @desc: click会带来url变更的，处理成a标签href属性，但阻止默认行为
 */
import React from 'react';
import useSeoUrl from '@/hooks/useSeoUrl';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';

const SeoLink = ({
  symbol,
  onClick,
  tradeType,
  needCheckMarginTab,
  ...otherProps
}) => {
  const seoUrl = useSeoUrl({ symbol, tradeType, needCheckMarginTab });

  const handleClick = useMemoizedFn((e) => {
    e.preventDefault();
    if (onClick) onClick(e);
  });

  return <a href={seoUrl} onClick={handleClick} {...otherProps} />;
};

export default React.memo(SeoLink);
