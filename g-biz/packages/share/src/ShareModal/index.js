import React, { useCallback } from 'react';
import { useResponsive, ThemeProvider, Notification, Snackbar } from '@kux/mui';
import isFunction from 'lodash/isFunction';

import ShareMobile from './mobile';
import SharePc from './pc';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const _stop = (e) => {
  e && e.stopPropagation();
};

const ShareModal = (props) => {
  const {
    onCancel = () => {},
    createImg = () => {},
    maskClose = true, // 是否允许点击蒙版区域关闭
    diyModalShareClick,
    ...other
  } = props || {};
  const { xs, sm, lg, xl } = useResponsive();
  const isMobile = xs && !sm && !lg && !xl; // 是否h5

  const { appClickSaveAsImg } = other || {};

  const _createImg = useCallback(
    (e) => {
      _stop(e);
      createImg(undefined, appClickSaveAsImg);
    },
    [createImg, appClickSaveAsImg],
  );

  const maskClick = useCallback(() => {
    if (maskClose) {
      onCancel();
    }
  }, [maskClose, onCancel]);

  const shareClick = useCallback(
    (url, gaKey, data) => {
      if (isFunction(diyModalShareClick)) {
        diyModalShareClick(url, gaKey, data);
        return;
      }
      if (url) {
        window.open(url);
      }
    },
    [diyModalShareClick],
  );

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
// ThemeProvider
export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <ShareModal {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
