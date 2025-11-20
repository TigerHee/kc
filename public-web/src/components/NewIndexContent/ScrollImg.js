/**
 * Owner: chelsey.fan@kupotech.com
 */
import React, { memo } from 'react';
import LazyImg from 'components/common/LazyImg';

const ScrollImg = (props) => {
  const { src: imgSrc, ...rest } = props;

  return <LazyImg src={imgSrc} {...rest} />;
};
export default memo(ScrollImg);
