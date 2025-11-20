/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { TextArea, useResponsive } from '@kux/mui';
import { _t, addLangToPath } from 'tools/i18n';
import storage from 'src/utils/storage';
import { useLocale } from '@kucoin-base/i18n';
import { useSelector } from 'src/hooks/useSelector';
import Share from './Share';
import { trackClick } from 'utils/ga';
import go from 'static/bitcoin-halving/go.svg';
import giftJson from 'static/bitcoin-halving/gift.json';
import {
  Wrapper,
  Line,
  SignWrapper,
  ShareWrapper,
  SignH5,
  Button,
  LoadingLogo,
} from './index.style';

export default () => {
  const [value, setValue] = useState();
  const { isLogin } = useSelector((state) => state.user);
  const responsive = useResponsive();
  const { currentLang } = useLocale();

  useEffect(() => {
    storage.removeItem('signup.account');
  }, []);

  const handleSignUp = useCallback(() => {
    let url = '/ucenter/signup';
    if (value) {
      if (/@/.test(value)) {
        storage.setItem('signup.account', {
          type: 'email',
          value,
        });
        url = '/ucenter/signup?type=mail';
      } else {
        storage.setItem('signup.account', {
          type: 'phone',
          value,
        });
        url = '/ucenter/signup?type=phone';
      }
    }
    trackClick(['sginup', '1']);
    window.location.href = addLangToPath(url);
  }, [value]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return (
    <Wrapper>
      <ShareWrapper isEn={currentLang === 'en_US'}>
        <Share imgWidth={28} imgHeight={28} contentMarginTop={14} staticGap />
      </ShareWrapper>
      <Line />
      {!isLogin && !responsive.sm && (
        <SignH5>
          <TextArea
            maxRows={2}
            placeholder={_t('nT2xj43ctSeL4kNa3RzXtJ')}
            value={value}
            onChange={handleChange}
          />
          <Button onClick={handleSignUp}>
            <LoadingLogo lottieJson={giftJson} loop />
            <span>{_t('cQMoH2cnJJBsQK4t3DoqH5')}</span>
            <img src={go} alt="go" />
          </Button>
        </SignH5>
      )}
      {!isLogin && responsive.sm && (
        <SignWrapper isEn={currentLang === 'en_US'}>
          <TextArea
            placeholder={_t('nT2xj43ctSeL4kNa3RzXtJ')}
            size="large"
            value={value}
            maxRows={2}
            onChange={handleChange}
          />
          <Button onClick={handleSignUp}>
            <LoadingLogo lottieJson={giftJson} loop />
            <span>{_t('cQMoH2cnJJBsQK4t3DoqH5')}</span>
            <img src={go} alt="go" />
          </Button>
        </SignWrapper>
      )}
    </Wrapper>
  );
};
