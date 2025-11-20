/*
 * Owner: harry.lai@kupotech.com
 */
import { cx } from '@emotion/css';
import useLockBodyScroll from 'src/hooks/useLockBodyScroll';
import { BlurMask, fadeOutAnimation, Spin } from './styled';

const Loading = ({ isVisible }) => {
  useLockBodyScroll(isVisible);

  if (!isVisible) {
    return null;
  }

  return (
    <BlurMask className={cx(isVisible && fadeOutAnimation)}>
      <Spin type="normal" />
    </BlurMask>
  );
};

export default Loading;
