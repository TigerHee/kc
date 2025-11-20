/*
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import React, { useMemo, useCallback } from 'react';
import { ThemeProvider } from '@kufox/mui';
import { useSelector } from 'dva';
import dotPng from 'assets/cryptoCup/background-dot.png';
import Banner from './Banner';
import Guide from './Guide';
import RaceSteps from './common/RaceSteps';
import MatchScore from './MatchScore';
import SelectTeam from './SelectTeam';
import RaceTimeCard from './RaceTimeCard';
import CurrentPrize from './CurrentPrize';
import TotalPrize from './TotalPrize';
import WinTeam from './WinTeam';
import RaceSucResult from './RaceResult/Suc';
import RaceFailResult from './RaceResult/Fail';
import SucBlindboxModal from './BlindboxAwardModal/Suc';
import FailBlindboxModal from './BlindboxAwardModal/Fail';
import InviteHelpModal from './HelpModal/Invite';
import HelpModal from './HelpModal';
import LoginModal from './HelpModal/Login';
import HelpFailModal from './HelpModal/Fail';
import HelpSucModal from './HelpModal/Suc';
import useGetSelectedSeason from './hooks/useGetSelectedSeason';
import { CupMain, RaceTimeCardOccupy, Wrapper, Page } from './common/StyledComps';
import './index.less';

const BackgroundColor = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #d3ffc9 0%, #c2f2dd 100%);
  border-top-right-radius: 100px;
  position: relative;
  padding-bottom: 40px;
`;

const BackgroundDot = styled.div`
  width: 162px;
  height: 162px;
  background: url(${dotPng}) no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  right: 0;
`;

function WorldCup() {
  const { isLogin } = useSelector(state => state.user); // 是否登陆
  const { isJoin } = useSelector(state => state.cryptoCup);
  const loading = useSelector(state => state.loading);
  const { serverTime } = useSelector(state => state.app);
  const userInfoLoading = loading.effects['app/getUserInfo'];
  const registLoading = loading.effects['cryptoCup/getRegistInfo'];
  const getCampaignsLoading = loading.effects['cryptoCup/getCampaigns'];
  const { season, curSelectedSeasonIndex } = useGetSelectedSeason();

  const content = useMemo(
    () => {
      if (userInfoLoading || registLoading) return null;
      // 已报名 或 赛季结束 展示比赛面板
      if ((isLogin && isJoin) || season?.status === 3) {
        return <MatchScore />;
      }
      return (
        <>
          <SelectTeam />
          {curSelectedSeasonIndex === 3 ? null : <CurrentPrize />}
          <TotalPrize />
        </>
      );
    },
    [userInfoLoading, registLoading, isJoin, isLogin, season, curSelectedSeasonIndex],
  );

  const renderRaceTime = useCallback(
    contents => {
      if (
        isLogin === undefined ||
        userInfoLoading ||
        registLoading ||
        getCampaignsLoading ||
        !serverTime
      ) {
        return null;
      }
      if (!isLogin) {
        return contents;
      }
      if (isJoin || season?.status === 3) {
        return null;
      }

      return contents;
    },
    [userInfoLoading, registLoading, isJoin, isLogin, getCampaignsLoading, season, serverTime],
  );

  return (
    <ThemeProvider>
      <Wrapper className="page-with-768">
        <Page id="CRYPTO_CUP_SCROLL_EL" data-inspector="CryptoCupPage">
          <Banner />
          <Guide />
          <BackgroundColor>
            <BackgroundDot />
            <>{renderRaceTime(<RaceTimeCard />)}</>
            <CupMain className="CryptoCup-main">
              <RaceSteps />
              <>
                <WinTeam />
                {content}
              </>
            </CupMain>
            <>
              {renderRaceTime(<RaceTimeCardOccupy />)}
              <RaceSucResult />
              <RaceFailResult />
              <SucBlindboxModal />
              <FailBlindboxModal />
              <InviteHelpModal />
              <HelpModal />
              <LoginModal />
              <HelpFailModal />
              <HelpSucModal />
            </>
          </BackgroundColor>
        </Page>
      </Wrapper>
    </ThemeProvider>
  );
}

export default WorldCup;
