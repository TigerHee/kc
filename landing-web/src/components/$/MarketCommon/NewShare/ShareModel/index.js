/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useIsMobile } from '../../config';
import loadable from '@loadable/component';
const ShareMobile = loadable(() => import('./mobile'));
const SharePc = loadable(() => import('./pc'));

const _stop = (e) => {
  e && e.stopPropagation();
};

const ShareModel = (props) => {
  const {
    onCancel = () => {},
    createImg = () => {},
    maskClose = true, // 是否允许点击蒙版区域关闭
    ...other
  } = props || {};
  const isMobile = useIsMobile(); // 是否h5
  const { appClickSaveAsImg } = other || {};

  const _createImg = useCallback(
    (e) => {
      _stop(e);
      createImg(undefined, appClickSaveAsImg);
    },
    [createImg],
  );

  const maskClick = useCallback(() => {
    if (maskClose) {
      onCancel();
    }
  }, [maskClose, onCancel]);

  const shareClick = useCallback((url, gaKey) => {
    if (url) {
      window.open(url);
    }
  }, []);

  if (isMobile) {
    return (
      <ShareMobile
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
      {...other}
      createImg={_createImg}
      shareClick={shareClick}
      onCancel={onCancel}
      maskClose={maskClose}
    />
  );
};

export default ShareModel;
