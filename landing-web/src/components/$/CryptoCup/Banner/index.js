/**
 * Owner: tom@kupotech.com
 */

import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import router from 'umi/router';
import { styled } from '@kufox/mui/emotion';
import AnniversaryHeader from 'components/AnniversaryHeader';
import NewShare from 'components/$/MarketCommon/NewShare';
import { _t } from 'utils/lang';
import { openPage, Event } from 'helper';
import {
  getRuleUrl,
  BANNER,
  SHARE,
  SPLITER_WIDTH,
  CONTENT_WIDTH,
  cryptoCupTrackClick,
  cryptoCupExpose,
} from '../config';
import useInviteLink from '../hooks/useInviteLink';
import ArrowBackSvg from 'assets/global/arrow-left.svg';
import langCheckedSvg from 'assets/prediction/lang-checked.svg';
import shareSvg from 'assets/prediction/share.svg';

const shareTexts = [
  {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 5,
    wordSpace: 2,
    text: 'Start trading BTC, ETH and KCS now!',
    x: 60,
    y: 615,
    firstWidth: 200,
    needCompute: true,
    newLine: true,
    independent: true,
  },
  {
    color: '#b8c6d8',
    fontSize: 14,
    fontWeight: '400',
    wordSpace: 2,
    text: `Download ${window._BRAND_NAME_} APP`,
    x: 60,
    y: 645,
    needCompute: true,
    newLine: true,
    independent: true,
  },
];

const Share = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 9px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 0;
  padding: 50% 50% 43.7% 50%;
  position: relative;
  background: ${props => `url(${props.banner}) no-repeat`};
  background-size: 100% auto;
  border-bottom-left-radius: 100px;
  border-bottom: 1px solid #c1fcee;
`;

const Header = styled.div`
  width: 100%;
  position: absolute;
  top: 32px;
  left: 0;
  @media (min-width: ${SPLITER_WIDTH}px) {
    width: ${CONTENT_WIDTH}px;
  }
  ${props =>
    props.isSticky &&
    ` 
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.8);
    z-index: 999;
  `}
  ${props =>
    props.isInApp &&
    props.isSticky &&
    `
    padding: 32px 0 10px 0;
    `}
`;

const Entrance = styled.div`
  position: absolute;
  right: -1px;
  top: 71%;
`;

const EntranceItem = styled.div`
  cursor: pointer;
  min-width: 40px;
  min-height: 24px;
  padding: 0 8px;
  background: #fbe656;
  border-radius: 12px 0px 0px 12px;
  border: 1.5px solid rgba(0, 0, 0, 1);
  color: #000d1d;
  font-size: 12px;
  display: flex;
  align-items: center;
  & + & {
    margin-top: 14px;
  }
`;

function Banner() {
  const shareRef = useRef(null);
  const headRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const { isLogin } = useSelector(state => state.user);
  const { isInApp, currentLang } = useSelector(state => state.app);

  // 分享给好友的链接
  const { inviteLink } = useInviteLink();

  // const { inviteCode } = useSelector(state => state.cryptoCup);
  // // 分享给好友的链接
  // const shareLink = inviteCode
  //   ? `https://kucoin.onelink.me/iqEP/ojnk32bi?rcode=${inviteCode}`
  //   : 'https://kucoin.onelink.me/iqEP/ojnk32bi';
  // banner多语图
  const bannerImg = BANNER[currentLang] || BANNER[window._DEFAULT_LANG_];
  // 分享多语图
  const shareImg = SHARE[currentLang] || SHARE[window._DEFAULT_LANG_];

  useEffect(() => {
    cryptoCupExpose(['rules', '1']);
    cryptoCupExpose(['myrecord', '1']);
  }, []);

  useEffect(() => {
    const handleScroll = event => {
      if (headRef.current) {
        const scrollTop =
          (event.srcElement ? event.srcElement.documentElement.scrollTop : false) ||
          window.pageYOffset ||
          (event.srcElement ? event.srcElement.body.scrollTop : 0);

        if (scrollTop > 32) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    Event.addHandler(window, 'scroll', handleScroll);
    return () => {
      Event.removeHandler(window, 'scroll', handleScroll);
    };
  }, []);

  const goShare = useCallback(() => {
    cryptoCupTrackClick(['share', '1']);
    shareRef.current.goShare();
  }, []);

  const goRule = useCallback(
    () => {
      openPage(isInApp, getRuleUrl(currentLang));
      cryptoCupTrackClick(['rules', '1']);
    },
    [isInApp, currentLang],
  );

  const shareIcon = useMemo(
    () => {
      return <Share src={shareSvg} alt="share" onClick={goShare} />;
    },
    [goShare],
  );

  return (
    <>
      <Wrapper banner={bannerImg}>
        <Header ref={headRef} isSticky={isSticky} isInApp={isInApp}>
          <AnniversaryHeader
            showRightBox
            logoUrl={ArrowBackSvg}
            logoStyle={{ width: '24px', height: '24px' }}
            showCheckedImg
            checkedImgUrl={langCheckedSvg}
            blockId="Login"
            customRightOpt={shareIcon}
          />
        </Header>
        <Entrance>
          <EntranceItem onClick={goRule}>{_t('cryptoCup.banner.rule')}</EntranceItem>
          <>
            {isLogin ? (
              <EntranceItem
                onClick={() => {
                  cryptoCupTrackClick(['myrecord', '1']);
                  router.push('/crypto-cup-my');
                }}
              >
                {_t('cryptoCup.banner.my')}
              </EntranceItem>
            ) : null}
          </>
        </Entrance>
        <NewShare
          ref={shareRef}
          shareLink={inviteLink}
          shareImg={shareImg}
          shareTexts={shareTexts}
        />
      </Wrapper>
    </>
  );
}

export default Banner;
