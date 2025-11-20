/**
 * Owner: ella.wang@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { Input, Button, useResponsive } from '@kux/mui';
import { ICArrowRight2Outlined } from '@kux/icons';
import { useSelector } from 'src/hooks/useSelector';
import storage from 'src/utils/storage';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import Share from '../Share';
import Countdown from '../Countdown';
import {
  Wrapper,
  InfoWrapper,
  Title,
  SubTitle,
  Description,
  Image,
  ContentWrapper,
  SignWrapper,
  Line,
  SignH5,
  TopImage,
  BottomImage,
} from './index.style';
import BannerImg from 'static/mining-pool/bannerimg.svg';
import BannerMdBg from 'static/mining-pool/bannermdbg.svg';
import Bannertop from 'static/mining-pool/bannertop.svg';
import Bannerbottom from 'static/mining-pool/bannerbottom.svg';

export default ({
  title = '',
  subTitle = '',
  description = '',
  hasCountdown = false,
  shareBlockid,
  signupBlockid,
  bannerImage,
  bannerMdImage,
  bannertop,
  bannerbottom,
  showCenter = false,
  shareTitle = '',
}) => {
  const [value, setValue] = useState();
  const { isLogin } = useSelector((state) => state.user);
  const responsive = useResponsive();

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
    if (signupBlockid) {
      trackClick([signupBlockid, '1']);
    }
    window.location.href = addLangToPath(url);
  }, [value, signupBlockid]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return (
    <Wrapper>
      <InfoWrapper>
        {title && <Title fontSizeChange={hasCountdown}>{title}</Title>}
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        {hasCountdown && <Countdown />}
        {description && <Description hasCountdown={hasCountdown}>{description}</Description>}
      </InfoWrapper>
      {responsive.sm ? (
        <Image
          src={responsive.lg ? bannerImage || BannerImg : bannerMdImage || BannerMdBg}
          showCenter={showCenter}
        />
      ) : (
        <React.Fragment>
          <TopImage src={bannertop || Bannertop} />
          <BottomImage src={bannerbottom || Bannerbottom} />
        </React.Fragment>
      )}
      {!isLogin && responsive.sm && (
        <ContentWrapper>
          <Share blockid={shareBlockid} shareTitle={shareTitle} />
          <Line />
          <SignWrapper>
            <Input
              placeholder={_t('nT2xj43ctSeL4kNa3RzXtJ')}
              size="large"
              value={value}
              onChange={handleChange}
            />
            <Button
              endIcon={<ICArrowRight2Outlined size={16} />}
              size="large"
              onClick={handleSignUp}
            >
              {_t('banner.sign')}
            </Button>
          </SignWrapper>
        </ContentWrapper>
      )}
      {!isLogin && !responsive.sm && (
        <SignH5>
          <Input placeholder={_t('nT2xj43ctSeL4kNa3RzXtJ')} value={value} onChange={handleChange} />
          <Button onClick={handleSignUp}>{_t('banner.sign')}</Button>
        </SignH5>
      )}
    </Wrapper>
  );
};
