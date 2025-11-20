/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
// import { ga } from 'utils/ga';
import { useIsMobile } from 'components/Responsive';
import ShareMobile from './mobile';
import SharePc from './pc';

const _stop = e => {
  e && e.stopPropagation();
};

const ShareModel = props => {
  const {
    isZh = false,
    onCancel = () => {},
    createImg = () => {},
    maskClose = true, // 是否允许点击蒙版区域关闭
    ...other
  } = props || {};
  const isMobile = useIsMobile(); // 是否h5

  const _createImg = useCallback(
    e => {
      _stop(e);
      createImg();
    },
    [createImg],
  );

  const maskClick = useCallback(
    () => {
      if (maskClose) {
        onCancel();
      }
    },
    [maskClose, onCancel],
  );

  const shareClick = useCallback((url, gaKey) => {
    if (url) {
      window.open(url);
    }
  }, []);

  if (isMobile) {
    return (
      <ShareMobile
        isZh={isZh}
        _stop={_stop}
        {...other}
        createImg={_createImg}
        maskClick={maskClick}
        shareClick={shareClick}
        onCancel={onCancel}
      />
    );
  }

  return (
    <SharePc
      isZh={isZh}
      {...other}
      createImg={_createImg}
      shareClick={shareClick}
      onCancel={onCancel}
      maskClose={maskClose}
    />
  );
};

export default ShareModel;
