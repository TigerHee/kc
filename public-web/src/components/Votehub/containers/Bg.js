/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { useResponsiveSize } from '../hooks';
import { StyledBg } from '../styledComponents';

const Bg = () => {
  const isInApp = JsBridge.isApp();
  const size = useResponsiveSize();
  const [bgImg, setBgImg] = useState('');
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const bgImgPromise = useMemo(() => {
    if (size === 'md') {
      return currentTheme === 'light'
        ? import('static/votehub/banner_pad.png')
        : import('static/votehub/banner_pad_dark.png');
    } else if (size === 'lg') {
      return currentTheme === 'light'
        ? import('static/votehub/banner_lg.png')
        : import('static/votehub/banner_lg_dark.png');
    }
    return currentTheme === 'light'
      ? import('static/votehub/banner_sm.png')
      : import('static/votehub/banner_sm_dark.png');
  }, [size, currentTheme]);

  useEffect(() => {
    bgImgPromise.then((m) => setBgImg(m.default));
  }, [bgImgPromise]);

  if (size === 'lg') return null;
  return (
    <StyledBg isInApp={isInApp}>
      <img width={375} height={344} src={bgImg} alt="bg" />
    </StyledBg>
  );
};

export default memo(Bg);
