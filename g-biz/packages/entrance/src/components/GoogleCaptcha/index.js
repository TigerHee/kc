/**
 * Owner: iron@kupotech.com
 */
import React, { useRef, useState } from 'react';
import { Box, Portal, Spin, styled } from '@kux/mui';
import noop from 'lodash/noop';
import useScript from 'react-script-hook';
import Recaptcha from 'react-recaptcha';
import { useLang } from '../../hookTool';

const BgWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const RecaptchaWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function GoogleCaptcha(props = {}) {
  const {
    sitekey,
    src = 'https://www.recaptcha.net/recaptcha/api.js?render=explicit',
    onSuccess = noop,
    visible,
    onClose = noop,
  } = props;

  const googleRef = useRef();
  const [loading, error] = useScript({ src });
  const [loadingShow, setLoadingShow] = useState(true);
  const { t } = useLang();

  if (error) {
    // TODO:
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const verifyCallback = (res) => {
    if (res) {
      onSuccess(res);
      // 重置人机验证
      if (googleRef.current && googleRef.current.reset) {
        googleRef.current.reset();
      }
      handleClose();
    }
  };

  const onloadCallback = () => {
    setLoadingShow(false);
  };

  const expiredCallback = () => {};

  return visible ? (
    <Portal>
      <BgWrapper onClick={handleClose}>
        {!loading ? (
          <RecaptchaWrapper>
            <Recaptcha
              ref={(e) => {
                googleRef.current = e;
              }}
              elementID="recaptcha"
              sitekey={sitekey}
              render="explicit"
              hl={t('locale') !== 'locale' ? t('locale') : 'en'}
              verifyCallback={verifyCallback}
              onloadCallback={onloadCallback}
              expiredCallback={expiredCallback}
            />
          </RecaptchaWrapper>
        ) : null}
        {loadingShow ? (
          <Box width={352} padding={8}>
            <Spin />
          </Box>
        ) : null}
      </BgWrapper>
    </Portal>
  ) : null;
}
