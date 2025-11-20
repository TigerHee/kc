/**
 * Owner: garuda@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';

import { styled } from '@kux/mui/emotion';

import { useDispatch } from 'dva';
import { evtEmitter as eventEmmiter } from 'helper';

import { trackClick } from 'utils/ga';
import { _t } from 'utils/lang';

import { Dialog } from '@kux/mui';
import Spin from '@mui/Spin';

import PosterImage from '@/components/CustomerShare/PosterImage';
import { FUTURES_SHARE_PNL_ERROR, FUTURES_SHARE_PNL_MODAL } from '@/meta/futuresSensors/trade';

import { useGetShareLink, useModalProps } from './hook';
import ShareContent from './ShareContent';
import ShareBackground from './ShareContent/ShareBackground';
import { openAppShare } from './utils';

const eventHandle = eventEmmiter.getEvt();

const MDialog = styled(Dialog)`
  .KuxDialog-body {
    background-color: rgba(0, 13, 29, 0.3);
    border-radius: 0;
    height: 100%;
  }
  .KuxDialog-content {
    height: 100%;
  }
  .loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .KuxSpin-root {
      align-self: unset;
    }
  }
  .app-share {
    position: absolute;
    z-index: -2;
    top: 0;
    left: 0;
    visibility: hidden;
  }
`;

const AppShareModal = () => {
  const dispatch = useDispatch();
  const { shareLink, referralCode } = useGetShareLink();
  const { visible, closeModal, posterRef } = useModalProps();

  const [loadInit, setLoadInit] = useState(false);

  const handleOpenShare = useCallback(async () => {
    try {
      const pic = await posterRef?.current.generatePoster();
      openAppShare({ pic, referralCode, shareLink });
      closeModal();
    } catch (err) {
      dispatch({
        type: 'notice/feed',
        payload: {
          type: 'message.error',
          message: _t('share.posterError'),
        },
      });
      closeModal();
      trackClick([FUTURES_SHARE_PNL_ERROR, '1'], { fail_reason: JSON.stringify(err) });
    }
  }, [closeModal, dispatch, posterRef, referralCode, shareLink]);

  useEffect(() => {
    if (visible) {
      if (loadInit && posterRef?.current) {
        handleOpenShare();
        trackClick([FUTURES_SHARE_PNL_MODAL, '3']);
      }
      return () => {
        if (!visible) {
          setLoadInit(false);
        }
      };
    }
  }, [handleOpenShare, loadInit, posterRef, visible]);

  const handleSetImageLoad = useCallback((data) => {
    setLoadInit(data);
  }, []);

  useEffect(() => {
    eventHandle.on('event/futures@pnlShareImageLoad', handleSetImageLoad);
    return () => {
      eventHandle.off('event/futures@pnlShareImageLoad', handleSetImageLoad);
    };
  }, [handleSetImageLoad]);

  return (
    <MDialog
      open={visible}
      size="fullWidth"
      showCloseX={false}
      onOk={closeModal}
      onCancel={closeModal}
      title=""
      cancelText=""
      okText=""
      maskClosable={false}
      footer={null}
    >
      <div className="loading">
        <Spin spinning />
      </div>
      <div className="app-share">
        <PosterImage
          shareLink={shareLink}
          canvasSize={{ width: 280, height: 420 }}
          shareTexts={[
            _t('futures.pnlShare.title'),
            _t('futures.share.referCode', { code: referralCode }),
          ]}
          ref={posterRef}
          shareContent={<ShareContent />}
          shareBackground={<ShareBackground />}
          saveFileName="futures-poster"
        />
      </div>
    </MDialog>
  );
};

export default React.memo(AppShareModal);
