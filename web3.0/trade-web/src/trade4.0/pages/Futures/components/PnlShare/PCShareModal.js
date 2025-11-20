/**
 * Owner: garuda@kupotech.com
 */
import React, { useEffect } from 'react';

import { styled } from '@kux/mui/emotion';

import { trackClick } from 'utils/ga';
import { _t } from 'utils/lang';

import Spin from '@mui/Spin';

import { ReactComponent as ADIcon } from '@/assets/share/ad-icon.svg';
import PosterImage from '@/components/CustomerShare/PosterImage';
import PosterModal from '@/components/CustomerShare/PosterModal';
import { FUTURES_SHARE_PNL_MODAL } from '@/meta/futuresSensors/trade';

import MobileCustomerDisplay from './ControlDisplay/MobileCustomerDisplay';
import MobileDisplay from './ControlDisplay/MobileDisplay';
import PCControlDisplay from './ControlDisplay/PCControlDisplay';
import { useGetShareLink, useModalProps } from './hook';
import ShareContent from './ShareContent';
import ShareBackground from './ShareContent/ShareBackground';

const Modal = styled(PosterModal)`
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    .KuxSpin-root{
      align-self: unset;
    }
  }
  .mobile-ad {
    display: flex;
    align-items: center;
    .mobile-ad-text {
      font-size: 12px;
      color: ${(props) => props.theme.colors.toast};
      line-height: 1.3;
      display: -webkit-box;
      flex: 1;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin: 0 4px;
    }
  }
`;

const PCShareModal = () => {
  const { shareLinkRCodeUtm, referralCode } = useGetShareLink();
  const {
    visible,
    closeModal,
    onCopy,
    onSave,
    onShareClick,
    posterRef,
    isMobile,
    loading,
    saveLoading,
  } = useModalProps();

  useEffect(() => {
    if (visible) {
      trackClick([FUTURES_SHARE_PNL_MODAL, isMobile ? '2' : '1']);
    }
  }, [isMobile, visible]);

  return (
    <>
      <Modal
        visible={visible}
        onCancel={closeModal}
        shareUrl={shareLinkRCodeUtm}
        onCopy={onCopy}
        onSave={onSave}
        onShareClick={onShareClick}
        shareTitle={_t('futures.pnlShare.shareMessage')}
        shareSlot={isMobile ? <MobileDisplay /> : <PCControlDisplay />}
        saveLoading={saveLoading}
        mobileShareSlot={
          <div className="mobile-ad">
            <ADIcon />
            <span className="mobile-ad-text">{_t('futures.pnlShare.mobileAD')}</span>
          </div>
        }
        content={
          <>
            {loading ? (
              <div className="loading" style={{ height: 420 }}>
                <Spin spinning />
              </div>
            ) : (
              <PosterImage
                shareLink={shareLinkRCodeUtm}
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
            )}
          </>
        }
      />
      <MobileCustomerDisplay />
    </>
  );
};

export default React.memo(PCShareModal);
