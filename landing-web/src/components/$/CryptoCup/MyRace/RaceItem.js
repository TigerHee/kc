/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { get } from 'lodash';
import { styled } from '@kufox/mui/emotion';
import { _t } from 'utils/lang';
import AntiDuplication from 'components/common/AntiDuplication';
import Button from '@kufox/mui/Button';
import Progress from '../common/Progress';
import useGetCoinImg from '../hooks/useGetCoinImg';
import { SEASON_NAME_MAP, getRecord } from '../config';

const Box = styled.div`
  margin-top: 12px;
  position: relative;
  padding: 16px 12px;
  background: #ffffff;
  border-radius: 12px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeadText = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.colors.text40};
`;

const HeadState = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 22px;
  padding: 2px 10px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #ffb012;
  border-radius: 0 12px;
`;

const HeadStateSuc = styled(HeadState)`
  font-size: 14px;
  background: linear-gradient(88.6deg, #ffefbd 1.68%, #ffffcd 98.05%);
`;

const HeadStateFail = styled(HeadState)`
  font-size: 14px;
  color: #a2a2a2;
  background: linear-gradient(88.6deg, #e9e9e9 1.68%, #f1f1f1 98.05%);
`;

const TokenLine = styled.div`
  margin: 12px 0 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CoinLogo = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
`;

const CoinLogoPlace = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: rgb(237, 239, 240);
`;

const CoinRight = styled.div``;

const CoinName = styled.div`
  margin: ${props => (props.isRight ? '0 8px 0 0' : '0 0 0 8px')};
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-align: ${props => (props.isRight ? 'center' : 'left')};
  color: ${props => props.theme.colors.text};
`;

const CoinItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: ${props => (props.isRight ? 'row-reverse' : 'row')};
`;

const VSText = styled.div`
  font-style: italic;
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  color: rgba(0, 13, 29, 0.3);
`;

const BtnContainer = styled.div`
  margin-top: 13px;
  display: flex;
  align-items: center;

  button {
    min-width: 114px;
    font-weight: 500;
    color: #2dc985;
    border-radius: 40px;
    border-color: #2dc985;
  }

  button + button {
    margin-left: 12px;
    flex: 1;
    color: ${props => props.theme.colors.text};
    background: #7ff2c0;

    &:hover {
      background: rgb(127, 242, 192, 0.8);
    }
  }
`;

const TeamText = styled.div`
  margin: 1px 0 0 4px;
  padding: 2px 7px;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  color: ${props => props.theme.colors.text40};
  text-transform: uppercase;
  background: rgba(0, 13, 29, 0.08);
  border-radius: 90px;
`;

const ScoreLine = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
`;

const ScoreNum = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
`;

const ScoreNumLeft = styled(ScoreNum)`
  color: #05bcff;
`;

const ScoreNumRight = styled(ScoreNum)`
  color: #fcc957;
`;

const Coin = memo(({ isRight = false, isMyTeam = false, data = {} }) => {
  const { teamCode = '' } = data || {};
  const { getIconUrl } = useGetCoinImg();
  const logoUrl = getIconUrl(teamCode);

  return (
    <CoinItem isRight={isRight}>
      <>{logoUrl ? <CoinLogo alt="" src={logoUrl} /> : <CoinLogoPlace />}</>
      <CoinRight>
        <CoinName isRight={isRight}>{teamCode}</CoinName>
        <>{isMyTeam ? <TeamText>my team</TeamText> : null}</>
      </CoinRight>
    </CoinItem>
  );
});

const RaceItem = props => {
  const {
    seasonId = null,
    seasonStatus = null,
    matchResult = null,
    seasonNameEn = '',
    ourTeam = {},
    enemyTeam = {},
    onSeeScore = () => {},
  } = props;
  const disabled = seasonStatus === 2;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { campaigns } = useSelector(state => state.cryptoCup);
  const campaignId = get(campaigns, 'id', undefined);
  const seasonNameFunc = get(SEASON_NAME_MAP, seasonNameEn, () => null);

  const handleSeeScore = useCallback(
    () => {
      const _ourTeam = { ...ourTeam, id: ourTeam?.teamId };
      const _enemyTeam = { ...enemyTeam, id: enemyTeam?.teamId };
      onSeeScore();
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          detailTeam: [_ourTeam, _enemyTeam],
        },
      });
    },
    [onSeeScore, dispatch, ourTeam, enemyTeam],
  );

  const renderStatus = useMemo(
    () => {
      if (seasonStatus > 2) {
        return matchResult ? (
          <HeadStateSuc>{_t('aExNQeKiSusTy6iKkaa4MG')}</HeadStateSuc>
        ) : (
          <HeadStateFail>{_t('gysUNL12b61NUuRyPvCaY2')}</HeadStateFail>
        );
      }
      if (seasonStatus === 2) return <HeadText>{_t('qZtxn4pNG3fNMTp8nPrieB')}</HeadText>;
      return null;
    },
    [seasonStatus, matchResult],
  );

  const seeAward = useCallback(
    async () => {
      setLoading(true);
      // 获取队伍比赛奖励
      const data = await dispatch({
        type: 'cryptoCup/getTeamRewards',
        payload: {
          campaignId,
          seasonId,
        },
      });
      setLoading(false);
      const isSuc = Array.isArray(data); // 决赛返回为空数组
      if (isSuc) {
        const isFinalRace = data?.length < 1;
        const _stateName = matchResult ? 'sucRewardModalVisible' : 'failRewardModalVisible';
        dispatch({
          type: 'cryptoCup/update',
          payload: { [_stateName]: true, isFinalRace, seasonNameEn },
        });
      }
    },
    [dispatch, matchResult, campaignId, seasonId, seasonNameEn],
  );

  return (
    <Box>
      <Head>
        <HeadText>{seasonNameFunc()}</HeadText>
        <>{renderStatus}</>
      </Head>
      <TokenLine>
        <Coin isMyTeam data={ourTeam} />
        <VSText>VS</VSText>
        <Coin isRight data={enemyTeam} />
      </TokenLine>
      <Progress
        height="6px"
        showNum={false}
        mainProgress={ourTeam?.totalScore}
        subProgress={enemyTeam?.totalScore}
      />
      <ScoreLine>
        <ScoreNumLeft>{getRecord(ourTeam, 'totalScore')}</ScoreNumLeft>
        <ScoreNumRight>{getRecord(enemyTeam, 'totalScore')}</ScoreNumRight>
      </ScoreLine>
      <BtnContainer>
        <AntiDuplication>
          <Button size="small" variant="outlined" disabled={disabled} onClick={handleSeeScore}>
            {_t('7vWRehditzouhncUeDpXCS')}
          </Button>
        </AntiDuplication>
        <Button size="small" disabled={disabled} loading={loading} onClick={seeAward}>
          {_t('sto4NUtVFvB4K3fVPz8nv4')}
        </Button>
      </BtnContainer>
    </Box>
  );
};

export default RaceItem;
