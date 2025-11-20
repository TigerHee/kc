/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { useSelector } from 'dva';
import { openPage } from 'helper';
import { _t } from 'utils/lang';
import { getRuleUrl, cryptoCupTrackClick, cryptoCupExpose } from '../config';
import useGetCoinImg from '../hooks/useGetCoinImg';
import useGetSelectedSeason from '../hooks/useGetSelectedSeason';
import BlockTitle from '../common/BlockTitle';
import WinnerBg from 'assets/cryptoCup/winner-bg.png';
import WinnerCoinImg from 'assets/cryptoCup/winner-coin.png';
import arrowRightSvg from 'assets/cryptoCup/arrow-right-yellow.svg';

const Container = styled.div``;

const Content = styled.div`
  position: relative;
  margin: 16px 0 24px;
  padding: 18px 12px 12px;
  background: #ffffff;
  border: 1px solid #51eaac;
  border-radius: 12px;
`;

const WinBanner = styled.img`
  width: 100%;
  position: relative;
  z-index: 1;
`;

const BottomLine = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BottomText = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${props => props.theme.colors.text40};
`;

const BottomButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const BottomGo = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #ffb012;
`;

const BottomArrow = styled.img`
  width: 16px;
`;

const CoinImage = styled.img`
  position: relative;
  z-index: 2;
  margin: 0 auto -65px;
  display: block;
  height: 106px;
`;

const CoinIcon = styled.img`
  position: absolute;
  z-index: 2;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
`;

const CoinName = styled.div`
  position: absolute;
  z-index: 2;
  top: 88px;
  left: 50%;
  transform: translateX(-50%);
  font-style: italic;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #bbb2a4;
`;

const WinTeam = () => {
  const { getIconUrl } = useGetCoinImg();
  const { isInApp, currentLang } = useSelector(state => state.app);
  const { season, curSelectedSeasonIndex, curSelectedSeasonTeams } = useGetSelectedSeason();
  const show = curSelectedSeasonIndex === 3 && season?.status === 3;
  const winTeam = (curSelectedSeasonTeams || []).find(item => item.groupRank === 1) || {};
  const coin = winTeam.code;
  const logo = getIconUrl(coin);

  // 去规则页面
  const goRule = useCallback(
    () => {
      openPage(isInApp, getRuleUrl(currentLang));
      cryptoCupTrackClick(['winner', '1']);
    },
    [isInApp, currentLang],
  );

  useEffect(
    () => {
      if (show) {
        cryptoCupExpose(['winner', '1']);
      }
    },
    [show],
  );

  if (show) {
    return (
      <Container onClick={goRule}>
        <BlockTitle name={_t('gxjK4mrFM3xiYMauy5MgdH')} />
        <Content>
          <CoinImage src={WinnerCoinImg} alt="winner-coin" />
          <WinBanner src={WinnerBg} alt="winner-bg" />
          <CoinIcon src={logo} alt="coin-logo" />
          <CoinName>{coin}</CoinName>
          <BottomLine>
            <BottomText>{_t('2cD86WGRThPKK2uckDyu6g', { num: 100000 })}</BottomText>
            <BottomButton>
              <BottomGo>{_t('2am82zF6TPz1W7xK2Sivv7')}</BottomGo>
              <BottomArrow src={arrowRightSvg} alt="arrow-right" />
            </BottomButton>
          </BottomLine>
        </Content>
      </Container>
    );
  }

  return null;
};

export default WinTeam;
