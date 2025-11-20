/**
 * Owner: tom@kupotech.com
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { get, find } from 'lodash';
import { styled } from '@kufox/mui/emotion';
import { Drawer, Spin } from '@kufox/mui';
import { _t } from 'utils/lang';
import { numberFixed, multiply } from 'helper';
import useGetTeam from '../hooks/useGetTeam';
import { GreenBorderBox, CupMain } from '../common/StyledComps';
import { SPLITER_WIDTH, CONTENT_WIDTH, getRecord } from '../config';
import leftArrow from 'assets/cryptoCup/left-arrow.svg';
import close from 'assets/cryptoCup/other-match-close.svg';
import tabBg from 'assets/cryptoCup/tabBg.svg';

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

const LeftIcon = styled.div`
  width: 14px;
  height: 14px;
  background: ${props => `url(${leftArrow}) no-repeat`};
  /* background-size: 100% 100%; */
  margin: 0 0 0 2px;
  position: absolute;
  left: 0;
  /* top: 22px; */

  background-size: auto;
  background-position: center;
  height: 100%;
  top: 0;
`;

const RightIcon = styled.div`
  width: 14px;
  height: 14px;
  background: url(${close}) no-repeat;
  /* background-size: 100% 100%; */
  margin: 0 0 0 2px;
  position: absolute;
  right: 0;
  /* top: 22px; */

  background-size: auto;
  background-position: center;
  height: 100%;
  top: 0;
`;

const Content = styled.div`
  height: calc(100% - 56px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MainBox = styled(GreenBorderBox)`
  margin: 0 auto 0;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
`;

const TabWrapper = styled.div`
  background: #e9feed;
  border: 0.4px solid #88dd98;
  border-radius: 90px;
  display: flex;
  height: 38px;
  align-items: center;
  padding: 0 4px;
`;

const Tab = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: ${props => (props.isActive ? '#00142A;' : ' #399875;')};
  width: 50%;
  background: #75fbaf;
  border-radius: 90px;
  line-height: 30px;
  font-style: italic;
  background-color: ${props => (props.isActive ? '#75FBAF;' : 'unset')};
  background-image: ${props => (props.isActive ? `url(${tabBg})` : 'unset')};
  background-repeat: no-repeat;
  background-position: top right;
`;

const THead = styled.div`
  /* margin-bottom: 8px; */
  display: flex;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  height: 38px;
  align-items: center;
  display: flex;
  flex-wrap: nowrap;

  color: rgba(0, 13, 29, 0.4);
`;

const TBody = styled.div`
  /* overflow-y: auto; */
  /* max-height: 400px; */
`;

const RulesTextList = styled.div`
  display: flex;
  flex-direction: column;
`;

const RulesText = styled.div`
  font-size: 12px;
  line-height: 130%;
  color: rgba(0, 13, 29, 0.68);
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &::before {
    display: block;
    flex-shrink: 0;
    content: '';
    width: 6px;
    height: 6px;
    background: #2dc985;
    margin-right: 12px;
    border-radius: 100%;
  }
`;

const RulesTextGreen = styled.div`
  color: #2dc985;
`;

const TRow = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #000d1d;
  height: 38px;
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
`;

const TailLine = styled(TRow)`
  background: #e9feed;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
`;

const TailIn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ColOne = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
`;

const ColTwo = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
`;

const ColThree = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  color: ${props => {
    let color = 'unset';

    if (props.isUp) {
      color = 'rgba(94, 211, 53, 1)';
    } else if (props.isDown) {
      color = 'rgba(246, 84, 84, 1)';
    }

    return color;
  }};
`;

const ColFour = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TableMain = styled(CupMain)`
  flex-direction: row;
`;

function Rules({ onClose, isDetail }) {
  const dispatch = useDispatch();
  const [tabKey, setTabKey] = useState(0);
  const loading = useSelector(state => state.loading.effects['cryptoCup/getTeamRecords']);
  const { campaigns, teamIdRecords } = useSelector(state => state.cryptoCup);
  const { myTeam, guestTeam } = useGetTeam(isDetail);
  const myRecord = find(teamIdRecords, e => e.teamId === myTeam.id) || {};
  const guestRecord = find(teamIdRecords, e => e.teamId === guestTeam.id) || {};

  useEffect(
    () => {
      if (myTeam.id && guestTeam.id) {
        dispatch({
          type: 'cryptoCup/getTeamRecords',
          payload: {
            campaignId: campaigns?.id,
            teamIdList: [myTeam.id, guestTeam.id],
          },
        });
      }
    },
    [campaigns, myTeam, guestTeam, dispatch],
  );

  const dataSource = useMemo(
    () => {
      if (tabKey === 0) return myRecord;
      if (tabKey === 1) return guestRecord;
      return {};
    },
    [tabKey, myRecord, guestRecord],
  );

  const renderContents = () => {
    const dayOneData = get(dataSource, 'pointDetailList[0]', {}) || {};
    const dayTwoData = get(dataSource, 'pointDetailList[1]', {}) || {};
    const dayThreeData = get(dataSource, 'pointDetailList[2]', {}) || {};
    const dayFourData = get(dataSource, 'pointDetailList[3]', {}) || {};

    const oneIncrease = get(dayOneData, 'increase', 0) || 0;
    const twoIncrease = get(dayTwoData, 'increase', 0) || 0;
    const threeIncrease = get(dayThreeData, 'increase', 0) || 0;
    const fourIncrease = get(dayFourData, 'increase', 0) || 0;

    return (
      <>
        <TRow>
          <TableMain>
            <ColOne>Day 1</ColOne>
            <ColTwo>{getRecord(dayOneData, 'point')}</ColTwo>
            <ColThree isUp={oneIncrease > 0} isDown={oneIncrease < 0}>
              <>{oneIncrease > 0 ? '+' : null}</>
              <>{dayOneData?.matchDay ? `${numberFixed(multiply(oneIncrease, 100), 2)}%` : '-'}</>
            </ColThree>
            <ColFour>{getRecord(dayOneData, 'score')}</ColFour>
          </TableMain>
        </TRow>
        <TRow>
          <TableMain>
            <ColOne>Day 2</ColOne>
            <ColTwo>{getRecord(dayTwoData, 'point')}</ColTwo>
            <ColThree isUp={twoIncrease > 0} isDown={twoIncrease < 0}>
              <>{twoIncrease > 0 ? '+' : null}</>
              <>{dayTwoData?.matchDay ? `${numberFixed(multiply(twoIncrease, 100), 2)}%` : '-'}</>
            </ColThree>
            <ColFour>{getRecord(dayTwoData, 'score')}</ColFour>
          </TableMain>
        </TRow>
        <TRow>
          <TableMain>
            <ColOne>Day 3</ColOne>
            <ColTwo>{getRecord(dayThreeData, 'point')}</ColTwo>
            <ColThree isUp={threeIncrease > 0} isDown={threeIncrease < 0}>
              <>{threeIncrease > 0 ? '+' : null}</>
              <>
                {dayThreeData?.matchDay ? `${numberFixed(multiply(threeIncrease, 100), 2)}%` : '-'}
              </>
            </ColThree>
            <ColFour>{getRecord(dayThreeData, 'score')}</ColFour>
          </TableMain>
        </TRow>
        <TRow>
          <TableMain>
            <ColOne>Day 4</ColOne>
            <ColTwo>{getRecord(dayFourData, 'point')}</ColTwo>
            <ColThree isUp={fourIncrease > 0} isDown={fourIncrease < 0}>
              <>{fourIncrease > 0 ? '+' : null}</>
              <>{dayFourData?.matchDay ? `${numberFixed(multiply(fourIncrease, 100), 2)}%` : '-'}</>
            </ColThree>
            <ColFour>{getRecord(dayFourData, 'score')}</ColFour>
          </TableMain>
        </TRow>
      </>
    );
  };

  return (
    <Main show onClose={onClose} anchor={'bottom'}>
      <Header>
        <>{isDetail && <LeftIcon onClick={onClose} />}</>
        <RightIcon onClick={() => onClose('all')} />
        <span>{_t('cryptoCup.scoreRules.title')}</span>
      </Header>
      <Content>
        <RulesTextList>
          <RulesText>{_t('cryptoCup.scoreRules.li1')}</RulesText>
          <RulesText>
            <div>
              <span>{_t('cryptoCup.scoreRules.li2')}</span>
              <RulesTextGreen> {_t('cryptoCup.scoreRules.li3')}</RulesTextGreen>
            </div>
          </RulesText>
          <RulesText>{_t('f6v92ozceWHfZAjUeHrJNH')}</RulesText>
        </RulesTextList>
        <Spin spinning={!!loading} tip="Loading...">
          <MainBox>
            <CupMain>
              <TabWrapper>
                <Tab isActive={tabKey === 0} onClick={() => setTabKey(0)}>
                  {myRecord?.teamCode || '-'}
                </Tab>
                <Tab isActive={tabKey === 1} onClick={() => setTabKey(1)}>
                  {guestRecord?.teamCode || '-'}
                </Tab>
              </TabWrapper>
              <THead>
                <ColOne>{_t('cryptoCup.scoreRules.day')}</ColOne>
                <ColTwo>{_t('cryptoCup.scoreRules.baseScore')}</ColTwo>
                <ColThree>{_t('cryptoCup.scoreRules.24')}</ColThree>
                <ColFour>{_t('3QW1AQrRacF9NkGp18CHJe')}</ColFour>
              </THead>
            </CupMain>
            <TBody>{renderContents()}</TBody>
            <TailLine>
              <TableMain>
                <TailIn>
                  <span>{_t('q9k3j5EEyF1W6PXboZwyzn')}</span>
                  <span>{getRecord(dataSource, 'totalScore')}</span>
                </TailIn>
              </TableMain>
            </TailLine>
          </MainBox>
        </Spin>
      </Content>
    </Main>
  );
}

export default Rules;
