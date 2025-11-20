/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
// import { ga } from 'utils/ga';
import { find } from 'lodash';
import { useIsMobile } from 'components/Responsive';
import { openPage } from 'helper';
import loadable from '@loadable/component';
import { getShareBtns as getShareBtnsH5 } from './mobile/config';
import { getShareBtns as getShareBtnsWEB } from './pc/config';
const ShareMobile = loadable(() => import('./mobile'));
const SharePc = loadable(() => import('./pc'));
const _stop = (e) => {
  e.stopPropagation();
};

const ShareModel = (props, ref) => {
  const {
    isZh = false,
    onCancel = () => {},
    createImg = () => {},
    maskClose = true, // 是否允许点击蒙版区域关闭
    isInApp,
    onlyDownloadChanel = false,
    options = {},
    ...other
  } = props || {};
  const _mediaMobile = options?.legacyMedia;
  const _isMobile = useIsMobile(); // 是否h5
  const isMobile = _mediaMobile !== undefined ? _mediaMobile : _isMobile;

  const _createImg = useCallback(
    (e) => {
      _stop(e);
      createImg();
    },
    [createImg],
  );

  const maskClick = useCallback(() => {
    if (maskClose) {
      onCancel();
    }
  }, [maskClose, onCancel]);

  const getLink = useCallback(
    (chanel) => {
      const getHandler = isMobile ? getShareBtnsH5 : getShareBtnsWEB;
      const { shareUrl, shareTitle, socialTitle } = other || {};
      const socialList = getHandler(shareUrl, socialTitle || shareTitle, false);
      const item = find(socialList, (i) => i.name === chanel);
      if (!item) return;
      return item.url;
    },
    [isMobile, other],
  );

  const shareClick = useCallback(
    (url, gaKey, name) => {
      let _url = '';
      if (other?.socialTitle) {
        _url = getLink(name);
      }
      if (!_url) _url = url;
      if (_url) {
        openPage(isInApp, _url);
      }
    },
    [isInApp, getLink, other?.socialTitle],
  );

  const openSocial = useCallback(
    (chanel) => {
      const url = getLink(chanel);
      if (url) {
        openPage(isInApp, url, true);
      }
    },
    [getLink, isInApp],
  );

  useImperativeHandle(
    ref,
    () => ({
      // 直接跳转社群链接
      openSocial,
    }),
    [openSocial],
  );

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
        onlyDownloadChanel={onlyDownloadChanel}
        openSocial={openSocial}
        options={options}
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
      onlyDownloadChanel={onlyDownloadChanel}
      openSocial={openSocial}
      options={options}
    />
  );
};

export default forwardRef(ShareModel);
