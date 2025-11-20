/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, Fragment, useMemo, useRef } from 'react';
import { useSelector } from 'dva';
import { useHistory } from 'react-router';
import { debounce, isFunction } from 'lodash';
import JsBridge from 'utils/jsBridge';
import { sensors } from 'utils/sensors';
import { LANDING_HOST } from 'utils/siteConfig';
import { _t, _tHTML } from 'src/utils/lang';
import { Index, Slogan, Title, Dec, Entrance, EntranceItem, Logo, Share } from './StyledComps';

import AnniversaryHeader from 'src/components/AnniversaryHeader';
import KU_COIN_LOGO from 'assets/prediction/kucoin-logo.svg';
import LANG_CHECKED from 'assets/prediction/lang-checked.svg';
import BANNER_DEC from 'assets/prediction/banner-dec.svg';
import ArrowBackSvg from 'assets/global/arrow-left.svg';
import SHARESVG from 'assets/prediction/share.svg';
import PosterShare from '../PosterShare';

const Banner = ({ btnClickCheck }) => {
  const { isInApp, currentLang } = useSelector(state => state.app);
  const needBreak = ['zh_CN', 'zh_HK', 'ko_KR', 'ja_JP', 'en_US'].includes(currentLang);

  const { push } = useHistory();
  // 跳转页面
  const goToPage = useCallback(
    debounce(
      url => {
        const targetUrl = `${LANDING_HOST}${url}`;
        // 跳转埋点
        sensors.trackClick([url === '/prediction/detail' ? 'List' : 'Rules', '1']);
        // 跳转
        if (url && isInApp) {
          const _url = `/link?url=${encodeURIComponent(targetUrl)}`;
          JsBridge.open({
            type: 'jump',
            params: {
              url: _url,
            },
          });
        } else {
          push(url);
        }
      },
      500,
      { leading: true, trailing: false },
    ),
    [push, isInApp],
  );
  // 点击去激活列表
  const goActivateList = useCallback(
    async () => {
      if (isFunction(btnClickCheck) && (await btnClickCheck())) {
        goToPage(`/prediction/detail`);
      }
    },
    [goToPage, btnClickCheck],
  );

  const shareRef = useRef(null);

  const goShare = useCallback(() => {
    shareRef.current.goShare();
    // 埋点
    sensors.trackClick(['Share', '1']);
  }, []);

  const customRightOpt = useMemo(() => {
    return <Share src={SHARESVG} alt="SHARESVG" onClick={goShare} />;
  }, []);

  return (
    <Index isInApp={isInApp}>
      <AnniversaryHeader
        showRightBox
        logoUrl={ArrowBackSvg}
        logoStyle={{ width: '24px', height: '24px' }}
        showCheckedImg
        checkedImgUrl={LANG_CHECKED}
        blockId="Login"
        customRightOpt={customRightOpt}
      />
      <Slogan>
        <Logo src={KU_COIN_LOGO} alt="KU_COIN_LOGO" />
        <Title needBreak={needBreak}>{_tHTML('prediction.bannerTitle')}</Title>
        <Dec>
          <span>{_t('prediction.bannerDec')}</span> <img src={BANNER_DEC} alt="BANNER_DEC" /> <span>USDT</span>
        </Dec>
      </Slogan>
      <Entrance>
        <EntranceItem onClick={() => goToPage(`/prediction/rule`)}>
          {_t('prediction.entrance.rule')}
        </EntranceItem>
        <EntranceItem className="detail-entrance" onClick={() => goActivateList()}>
          {_t('prediction.entrance.list')}
        </EntranceItem>
      </Entrance>
      <PosterShare ref={shareRef} type="activity" />
    </Index>
  );
};

export default Banner;
