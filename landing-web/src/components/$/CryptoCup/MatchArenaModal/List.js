/**
 * Owner: tom@kupotech.com
 */

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { throttle, find } from 'lodash';
import { styled } from '@kufox/mui/emotion';
import { Drawer } from '@kufox/mui';
import { _t } from 'utils/lang';
import { separateNumber } from 'helper';
import Progress from '../common/Progress';
import MatchDetailModal from '../MatchArenaModal/Detail';
import { SPLITER_WIDTH, CONTENT_WIDTH, getRecord } from '../config';
import useGetTeam from '../hooks/useGetTeam';
import useGetCoinImg from '../hooks/useGetCoinImg';
import useGetSelectedSeason from '../hooks/useGetSelectedSeason';
import close from 'assets/cryptoCup/other-match-close.svg';

const Main = styled(Drawer)`
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 0 21px 18px;
  height: 67vh;
  @media (min-width: ${SPLITER_WIDTH}px) {
    width: ${CONTENT_WIDTH}px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: center;
  position: relative;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: #000d1d;
`;

const Content = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
    background: transparent;
    width: 2px;
    height: 2px;
  }
`;

const Box = styled.div`
  background: #fcfffb;
  border: 0.5px solid #51eaac;
  border-radius: 12px;
  margin-bottom: 12px;
  min-height: 75px;
  padding: 10px 14px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:nth-of-type(1) {
    margin-top: 8px;
  }
`;

const LeftClose = styled.div`
  width: 14px;
  height: 14px;
  background: url(${close}) no-repeat;
  background-size: 100% 100%;
  margin: 0 0 0 2px;
  position: absolute;
  left: 0;
  top: 22px;
`;

const CoupleItemContent = styled.div`
  width: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CoupleItemIn = styled.div`
  width: 34px;
  height: 34px;
  display: flex;
  position: relative;
  background: ${props => `url(${props.url}) no-repeat`};
  /* background-size: 34px 34px; */
  background-size: 100% 100%;
  background-position: center;
  background-color: rgba(0, 13, 29, 0.08);
  border-radius: 50%;
  border: 2px solid #fff;
`;

const CoupleItemName = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  text-transform: uppercase;
  color: #00142a;
  margin-top: 5px;
`;

const MiddleLine = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  margin: 0 9px 8px;
`;

const VsText = styled.div`
  font-family: Roboto;
  font-style: italic;
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  color: rgba(0, 13, 29, 0.3);
`;

const ScoreWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: 12px;
`;

const MainScore = styled.div`
  color: #05bcff;
`;

const SubScore = styled.div`
  color: #fcc957;
`;

const ProgressWrapper = styled.div`
  width: 100%;
`;

function MatchArenaListModal({ onClose }) {
  const dispatch = useDispatch();
  const { teamRecords, campaigns } = useSelector(state => state.cryptoCup);
  const { season, seasonId } = useGetSelectedSeason();
  const [showDetail, setShowDetail] = useState(false);
  const { otherGroup } = useGetTeam();
  const { getIconUrl } = useGetCoinImg();

  const openDetail = useCallback(
    throttle(value => {
      if (season?.status === 3) {
        return;
      }
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          detailTeam: value,
        },
      });
      setShowDetail(true);
    }, 1000),
    [season],
  );

  const closeDetail = type => {
    if (type === 'all') {
      onClose();
    }
    setShowDetail(false);
    dispatch({
      type: 'cryptoCup/update',
      payload: {
        detailTeam: [],
      },
    });
  };

  return (
    <Main show onClose={onClose} anchor={'bottom'}>
      <Header>
        <LeftClose onClick={onClose} />
        <span>
          {seasonId === campaigns.currentSeasonId
            ? _t('cryptoCup.otherMatch.title')
            : _t('6d47TDBSWTVTbGisPC4ZyY')}
        </span>
      </Header>
      <Content>
        <>
          {Object.values(otherGroup)
            .filter(el => el.length === 2)
            .map((el, index) => {
              const [one, two] = el;
              const oneRecord = find(teamRecords, e => e.teamId === one.id) || {
                totalScore: '',
              };
              const twoRecord = find(teamRecords, e => e.teamId === two.id) || {
                totalScore: '',
              };
              return (
                <Box key={index} onClick={() => openDetail(el)}>
                  <CoupleItemContent>
                    <CoupleItemIn url={getIconUrl(one.code)} />
                    <CoupleItemName>{one.code}</CoupleItemName>
                  </CoupleItemContent>
                  <MiddleLine>
                    <VsText>VS</VsText>
                    <ScoreWrapper>
                      <MainScore>{separateNumber(getRecord(oneRecord, 'totalScore'))}</MainScore>
                      <SubScore>{separateNumber(getRecord(twoRecord, 'totalScore'))}</SubScore>
                    </ScoreWrapper>
                    <ProgressWrapper>
                      <Progress
                        height="6px"
                        showNum={false}
                        mainProgress={getRecord(oneRecord, 'totalScore')}
                        subProgress={getRecord(twoRecord, 'totalScore')}
                      />
                    </ProgressWrapper>
                  </MiddleLine>
                  <CoupleItemContent>
                    <CoupleItemIn url={getIconUrl(two.code)} />
                    <CoupleItemName>{two.code}</CoupleItemName>
                  </CoupleItemContent>
                </Box>
              );
            })}
        </>
      </Content>
      <>{showDetail && <MatchDetailModal onClose={closeDetail} />}</>
    </Main>
  );
}

export default MatchArenaListModal;
