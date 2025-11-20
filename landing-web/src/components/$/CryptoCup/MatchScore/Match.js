/**
 * Owner: tom@kupotech.com
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import router from 'umi/router';
import { styled } from '@kufox/mui/emotion';
import { Spin } from '@kufox/mui';
import AntiDuplication from 'components/common/AntiDuplication';
import { _t, _tHTML } from 'utils/lang';
import { useLogin } from 'src/hooks';
import Progress from '../common/Progress';
import MatchDownTime from './MatchDownTime';
import useGetTeam from '../hooks/useGetTeam';
import useGetCoinImg from '../hooks/useGetCoinImg';
import useGetTeamRecord from '../hooks/useGetTeamRecord';
import useGetSelectedSeason from '../hooks/useGetSelectedSeason';
import MatchRulesModal from '../MatchArenaModal/Rules';
import {
  cryptoCupTrackClick,
  getTeamPeople,
  goToDomBlock,
  getRecord,
  getAppLoginParams,
} from '../config';
import teamBgSvg from 'assets/cryptoCup/match-bg.svg';
import teamPersonSvg from 'assets/cryptoCup/match-team-person.svg';
import downSvg from 'assets/cryptoCup/match-arrow-down.svg';
import rightArrow from 'assets/cryptoCup/right-arrow.svg';
import heartSvg from 'assets/cryptoCup/earnpoints1.svg';
import moneySvg from 'assets/cryptoCup/earnpoints2.svg';
import defenseSvg from 'assets/cryptoCup/earnpoints3.svg';
import winnerPng from 'assets/cryptoCup/match-winner.png';

const Wrapper = styled.div`
  margin-top: 10px;
  background: linear-gradient(180.14deg, #efffeb 2.09%, #ffffff 99.87%);
  border: 1px solid #51eaac;
  border-radius: 12px;
  overflow: hidden;
`;

const TeamBox = styled.div`
  width: 100%;
  height: 0;
  padding: 15.4%;
  background: url(${teamBgSvg}) no-repeat;
  background-size: 100% auto;
  position: relative;
`;

const TeamLeft = styled.div`
  display: flex;
  position: absolute;
  left: 5%;
  top: 24%;
`;

const TeamRight = styled.div`
  display: flex;
  position: absolute;
  right: 5%;
  top: 24%;
`;

const TeamIconBox = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  position: relative;
`;

const WinnerImg = styled.img`
  width: 50px;
  position: absolute;
  top: -22px;
  left: -3px;
`;

const TeamIcon = styled.img`
  width: 100%;
`;

const TeamInfo = styled.div`
  margin: ${props => (props.left ? `3px 0 0 8px` : `3px 8px 0 0`)};
`;

const TeamTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #000d1d;
`;

const TeamMember = styled.div`
  font-size: 12px;
  color: rgba(0, 13, 29, 0.4);
  display: flex;
  align-items: center;
  ${props =>
    props.right &&
    ` 
    justify-content: flex-end;
  `}
`;

const TeamMemberIcon = styled.img`
  width: 10px;
  height: 10px;
  margin-right: 4px;
`;

const MyTeam = styled.div`
  min-height: 18px;
  margin-top: 6px;
  padding: 0 7px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 90px;
  font-weight: 500;
  font-size: 10px;
  color: #fff;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  padding: 12px 12px 16px 12px;
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ScoreItem = styled.div`
  font-weight: 700;
  font-size: 20px;
  color: ${props => (props.left ? `#1C98FA` : `#FCC957`)};
`;

const ProgressWrapper = styled.div`
  margin-top: 8px;
`;

const RuleWrapper = styled(Score)`
  margin-top: 12px;
`;

const Rule = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #2dc985;
  cursor: pointer;
`;

const ExpendTitle = styled(Score)`
  font-size: 12px;
  color: rgba(0, 13, 29, 0.4);
  cursor: pointer;
`;

const DownIcon = styled.img`
  margin-left: 4px;
  width: 12px;
  height: 12px;
  transition: transform 0.3s;
  ${props =>
    props.expend &&
    `
    transform: rotate(180deg);
  `}
`;

const ScoreDetail = styled.div`
  overflow: hidden;
  visibility: hidden;
  height: 0;
  min-height: 0;
  transition: height 0.3s ease-out;
  ${props =>
    props.expend &&
    `
    height: auto;
    overflow: visible;
    visibility: visible;
    margin-top: 12px;
    border-bottom: 1px solid transparent;
  `}
`;

const DetailTitleWrapper = styled(Score)``;

const DetailTitle = styled.div`
  margin: 0 8px;
  font-weight: 500;
  font-size: 12px;
  color: rgba(0, 13, 29, 0.3);
`;

const TitleLine = styled.div`
  flex: 1;
  border-top: 1px solid rgba(0, 13, 29, 0.08);
`;

const ScoreDetailItem = styled.div`
  margin: 13px 0 5px 0;
`;

const ItemTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  color: #000d1d;
`;

const ItemIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 4px;
`;

const ItemProgress = styled.div`
  margin-top: 10px;
`;

const ItemScore = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemMainScore = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: #1c98fa;
`;

const ItemSubScore = styled(ItemMainScore)`
  text-align: right;
  color: #fcc957;
`;

const BtnWrapper = styled.div`
  cursor: pointer;
  background: linear-gradient(180deg, #abfedd 0%, #06e2b5 100%);
  box-shadow: 0px 2px 0px 0px rgba(57, 156, 150, 1);
  border-radius: 90px;
  margin-top: 12px;
  width: 100%;
  padding: 4px;
  position: relative;

  ${props =>
    props.disable &&
    `
    background: linear-gradient(180deg, #d2ffee 0%, #80eed6 100%);
    box-shadow: 0px 2px 0px #9ccdca;
  `};
`;

const BtnFlur = styled.div`
  position: absolute;
  top: -12%;
  right: 50px;
  width: 16px;
  height: 130%;
  background: '#fbfff9';
  opacity: 0.5;
  filter: blur(3px);
  transform: rotate(26.64deg);
`;

const UpperScoreBtn = styled.div`
  min-height: 34px;
  border: 0.6px solid #e7fff4;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  line-height: 120%;
  text-align: center;
  color: ${props => (props.disable ? 'rgba(0, 13, 29, 0.4)' : '#000d1d')};
  &::after {
    display: ${props => (props.disable ? 'none' : 'block')};
    content: '';
    width: 12px;
    height: 12px;
    background: url(${rightArrow}) no-repeat;
    background-size: 100% 100%;
    margin: 0 0 0 2px;
  }
`;

const DownTimeWrapper = styled(Score)`
  margin-top: 12px;
  font-weight: 500;
  font-size: 12px;
  color: rgba(0, 13, 29, 0.3);
  flex-wrap: wrap;
  margin-bottom: -7px;
`;

const DownTimeText = styled.div`
  margin-bottom: 7px;
`;

const CurrentScoreWrapper = styled.div`
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  & > span > span {
    margin-left: 8px;
    color: #2dc985;
  }
`;

function Match({ isDetail, onClose }) {
  const dispatch = useDispatch();
  const timer = useRef(null);
  const [btnDisable, setBtnDisable] = useState(true);
  const [expend, setExpend] = useState(!!isDetail);
  const [showRule, setShowRule] = useState(false);

  const { isLogin } = useSelector(state => state.user);
  const { campaigns, isJoin, mySeasonScore } = useSelector(state => state.cryptoCup);
  const loading = useSelector(state => state.loading.effects['cryptoCup/getTeamRecords']);
  const { getIconUrl } = useGetCoinImg();
  const { handleLogin } = useLogin();
  const { season, seasonId } = useGetSelectedSeason();
  const { myTeam, guestTeam } = useGetTeam(isDetail);

  const { record: myRecord, todayRecord: myTodayRecord } = useGetTeamRecord(myTeam.id);
  const { record: guestRecord, todayRecord: guestTodayRecord } = useGetTeamRecord(guestTeam.id);
  // 判断分数高低
  const leftWinner = myTeam?.groupRank === 1;
  const rightWinner = guestTeam?.groupRank === 1;
  // 进行中
  const isProgress = season?.status === 2;
  // 已结束
  const isEnd = season?.status === 3;

  // 获取队伍积分
  const getRecordData = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/getTeamRecords',
        payload: {
          campaignId: campaigns?.id,
          seasonId: seasonId,
        },
      });
    },
    [campaigns, seasonId, dispatch],
  );

  useEffect(
    () => {
      // 进行中 / 已结束
      if (season?.status === 2 || season?.status === 3) {
        setBtnDisable(false);
        getRecordData();
      }
    },
    [season],
  );

  useEffect(
    () => {
      if (isProgress) {
        timer.current = setInterval(() => {
          getRecordData();
        }, 600000);
      }

      return () => {
        timer.current && clearInterval(timer.current);
      };
    },
    [isProgress],
  );

  const handleCloseRule = type => {
    if (type === 'all' && onClose) {
      onClose();
    }

    setShowRule(false);
  };

  const handleMatchBtn = () => {
    cryptoCupTrackClick(['missonlist', '1']);
    if (isProgress) {
      goToDomBlock('CryptoCup-EarnPoints-Anchor');
      return;
    }
    if (isEnd) {
      if (isLogin) {
        router.push('/crypto-cup-my');
      } else {
        handleLogin(getAppLoginParams());
      }
    }
  };

  return (
    <Spin spinning={!!loading} tip="Loading...">
      <Wrapper>
        <TeamBox>
          <TeamLeft>
            <TeamIconBox>
              <>{isEnd && leftWinner ? <WinnerImg src={winnerPng} alt="" /> : null}</>
              <TeamIcon src={getIconUrl(myTeam.code)} alt="" />
            </TeamIconBox>
            <TeamInfo left>
              <TeamTitle>{myTeam.code}</TeamTitle>
              <TeamMember>
                <TeamMemberIcon src={teamPersonSvg} alt="" />
                <span>{getTeamPeople(myTeam)}</span>
              </TeamMember>
              <>{isJoin && !isDetail && <MyTeam>MY TEAM</MyTeam>}</>
            </TeamInfo>
          </TeamLeft>

          <TeamRight>
            <TeamInfo>
              <TeamTitle>{guestTeam.code}</TeamTitle>
              <TeamMember right>
                <TeamMemberIcon src={teamPersonSvg} alt="" />
                <span>{getTeamPeople(guestTeam)}</span>
              </TeamMember>
            </TeamInfo>
            <TeamIconBox>
              <>{isEnd && rightWinner ? <WinnerImg src={winnerPng} alt="" /> : null}</>
              <TeamIcon src={getIconUrl(guestTeam.code)} alt="" />
            </TeamIconBox>
          </TeamRight>
        </TeamBox>

        <Content>
          <Score>
            <ScoreItem left>{getRecord(myRecord, 'totalScore')}</ScoreItem>
            <ScoreItem>{getRecord(guestRecord, 'totalScore')}</ScoreItem>
          </Score>

          <ProgressWrapper>
            <Progress
              height="8px"
              showNum={false}
              mainProgress={getRecord(myRecord, 'totalScore')}
              subProgress={getRecord(guestRecord, 'totalScore')}
            />
          </ProgressWrapper>

          <>
            {isEnd ? null : (
              <RuleWrapper>
                <AntiDuplication>
                  <Rule
                    onClick={() => {
                      setShowRule(true);
                      cryptoCupTrackClick(['scoringformula', '1']);
                    }}
                  >
                    {_t('oJn6EjyRpNKGHz1LibcxiT')}
                  </Rule>
                </AntiDuplication>
                <AntiDuplication>
                  <ExpendTitle
                    onClick={() => {
                      setExpend(!expend);
                      cryptoCupTrackClick(['score', '1']);
                    }}
                  >
                    <span>{_t('iLsx34syGoKPGiovsEuTkH')}</span>{' '}
                    <DownIcon expend={expend} src={downSvg} alt="" />
                  </ExpendTitle>
                </AntiDuplication>
              </RuleWrapper>
            )}
          </>

          <ScoreDetail expend={expend}>
            <DetailTitleWrapper>
              <TitleLine />
              <DetailTitle>{_t('cryptoCup.match.from')}</DetailTitle>
              <TitleLine />
            </DetailTitleWrapper>
            <ScoreDetailItem>
              <ItemTitle>
                <ItemIcon src={heartSvg} alt="" />
                <span>{_t('bZ3EVDa1tgQ2nU6ES3zpqN')}</span>
              </ItemTitle>
              <ItemProgress>
                <Progress
                  height="6px"
                  showNum={false}
                  mainProgress={getRecord(myTodayRecord, 'invitationPoint')}
                  subProgress={getRecord(guestTodayRecord, 'invitationPoint')}
                />
                <ItemScore>
                  <ItemMainScore>{getRecord(myTodayRecord, 'invitationPoint')}</ItemMainScore>
                  <ItemSubScore>{getRecord(guestTodayRecord, 'invitationPoint')}</ItemSubScore>
                </ItemScore>
              </ItemProgress>
            </ScoreDetailItem>
            <ScoreDetailItem>
              <ItemTitle>
                <ItemIcon src={moneySvg} alt="" />
                <span>{_t('cPVFWxSaMuD6PeytJZHkBq')}</span>
              </ItemTitle>
              <ItemProgress>
                <Progress
                  height="6px"
                  showNum={false}
                  mainProgress={getRecord(myTodayRecord, 'tradePoint')}
                  subProgress={getRecord(guestTodayRecord, 'tradePoint')}
                />
                <ItemScore>
                  <ItemMainScore>{getRecord(myTodayRecord, 'tradePoint')}</ItemMainScore>
                  <ItemSubScore>{getRecord(guestTodayRecord, 'tradePoint')}</ItemSubScore>
                </ItemScore>
              </ItemProgress>
            </ScoreDetailItem>
            <ScoreDetailItem>
              <ItemTitle>
                <ItemIcon src={defenseSvg} alt="" />
                <span>{_t('fdaTfb18EYQgRi2Xxsmdfo')}</span>
              </ItemTitle>
              <ItemProgress>
                <Progress
                  height="6px"
                  showNum={false}
                  mainProgress={getRecord(myTodayRecord, 'depositPoint')}
                  subProgress={getRecord(guestTodayRecord, 'depositPoint')}
                />
                <ItemScore>
                  <ItemMainScore>{getRecord(myTodayRecord, 'depositPoint')}</ItemMainScore>
                  <ItemSubScore>{getRecord(guestTodayRecord, 'depositPoint')}</ItemSubScore>
                </ItemScore>
              </ItemProgress>
            </ScoreDetailItem>
          </ScoreDetail>

          <>
            {!isDetail && (
              <>
                <AntiDuplication>
                  <BtnWrapper disable={btnDisable} onClick={handleMatchBtn}>
                    <>{isProgress && <BtnFlur />}</>
                    <UpperScoreBtn disable={btnDisable}>
                      <>{btnDisable && season?.status === 1 ? <MatchDownTime /> : null}</>
                      <>{isProgress ? _t('cryptoCup.match.btn') : null}</>
                      <>{isEnd ? _t('4mY4rZ1XvxW5Akb4NM2HSa') : null}</>
                    </UpperScoreBtn>
                  </BtnWrapper>
                </AntiDuplication>

                {isProgress && (
                  <DownTimeWrapper>
                    <DownTimeText>{_t('dTcfAcMp8PTdicdfdZxiok', { num: 10 })}</DownTimeText>
                    <CurrentScoreWrapper>
                      {_tHTML('cryptoCup.match.score', {
                        num: mySeasonScore,
                      })}
                    </CurrentScoreWrapper>
                  </DownTimeWrapper>
                )}
              </>
            )}
          </>
        </Content>
        <>{showRule && <MatchRulesModal isDetail={isDetail} onClose={handleCloseRule} />}</>
      </Wrapper>
    </Spin>
  );
}

export default Match;
