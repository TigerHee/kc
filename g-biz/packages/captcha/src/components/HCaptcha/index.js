/**
 * Owner: tiger@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Portal, Box, Spin, styled } from '@kux/mui';
import noop from 'lodash/noop';
import storage from '@utils/storage';

const BgWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingBox = styled(Box)`
  padding: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const storageKey = 'gbiz_hcaptcha_load';

export default ({ onVerify = noop, onClose = noop, captchaInit = {} }) => {
  const { apiKey, locale } = captchaInit;
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (storage.getItem(storageKey)) {
      setLoading(false);
    }
  }, []);

  const handleLoad = () => {
    setLoading(false);
    storage.setItem(storageKey, 1);
  };

  return (
    <Portal>
      <BgWrapper onClick={onClose}>
        <ContentWrapper>
          <HCaptcha
            sitekey={apiKey}
            onVerify={onVerify}
            onLoad={handleLoad}
            languageOverride={locale}
            reCaptchaCompat={false}
          />
        </ContentWrapper>
        {isLoading ? (
          <LoadingBox>
            <Spin />
          </LoadingBox>
        ) : null}
      </BgWrapper>
    </Portal>
  );
};
