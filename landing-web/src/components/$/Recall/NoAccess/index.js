/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { Button } from '@kufox/mui';
import useTheme from '@kufox/mui/hooks/useTheme';
import accessImgLight from 'assets/recall/not_access_light.svg';
import accessImgDark from 'assets/recall/not_access_dark.svg';
import { _t, addLangToPath } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { useSelector } from 'dva';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.base};
  border-top-left-radius: ${px2rem(12)};
  border-top-right-radius: ${px2rem(12)};
  flex: 1;
  padding: ${px2rem(16)} ${px2rem(24)};
  margin-top: ${({ bannerHeight }) => bannerHeight ? 0 : px2rem(14)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  height: ${px2rem(100)};
  margin-top: ${px2rem(72)};
  margin-bottom: ${px2rem(20)};
`;

const Desc = styled.p`
  font-size: ${px2rem(18)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: ${px2rem(20)};
  width: ${px2rem(180)};
  text-align: center;
`;

const NoAccess = ({ bannerHeight }) => {
  const { currentTheme } = useTheme();
  const { isInApp } = useSelector(state => state.app);
  const handleGoToTrade = () => {
    if (isInApp) {
      JsBridge.open({ type: 'jump', params: { url: '/quotes?type=0' } });
    } else {
      window.location.href = addLangToPath(`${KUCOIN_HOST}/markets/favorite`);
    }
  };
  return (
    <Wrapper bannerHeight={bannerHeight}>
      <Image src={currentTheme === 'light' ? accessImgLight : accessImgDark} />
      <Desc>{_t('9TrTFBujoHWY7tXPCVFh3t')}</Desc>
      <Button onClick={handleGoToTrade}>{_t('3b5egMLGeHw7pxgoumdqTi')}</Button>
    </Wrapper>
  );
};

export default NoAccess;
