/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { get, isNil } from 'lodash';
import { getUtcZeroTime } from 'helper';
import { _t, _tHTML } from 'src/utils/lang';
import { useDispatch, useSelector } from 'dva';
import classnames from 'classnames';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import AntiDuplication from 'components/common/AntiDuplication';

import stepL from 'assets/cryptoCup/stepL.png';
import stepR from 'assets/cryptoCup/stepR.png';
import stepM from 'assets/cryptoCup/stepM.png';
import stepLY from 'assets/cryptoCup/stepLY.png';
import stepRY from 'assets/cryptoCup/stepRY.png';
import stepMY from 'assets/cryptoCup/stepMY.png';
import stepFlag from 'assets/cryptoCup/stepFlag.png';

import { cryptoCupTrackClick, SEASON_TABS } from '../config';

const Wrapper = styled.div`
  /* width: calc(100% - 28px); */
  width: 100%;
  position: relative;
  margin: -18px auto 16px;
  display: flex;
`;

const Item = styled.div`
  width: 25%;
  padding: 0 9px;
  min-height: 38px;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  position: relative;

  &::after {
    position: absolute;
    display: none;
    content: '';
    width: 38px;
    height: 48px;
    background: ${props => `url(${stepFlag}) no-repeat`};
    background-size: 100% 100%;
    left: 50%;
    top: 50%;
    margin-left: -19px;
    margin-top: -24px;
  }

  &.seasons-isInProgress::after {
    display: block;
  }
`;

const ItemLeftIcon = styled.div`
  width: 9px;
  height: 100%;
  position: absolute;
  left: 1px;
  background: ${props => {
    return `url(${stepL}) no-repeat`;
  }};
  background-size: 100% 100%;
  .seasons-isActive & {
    background: ${props => {
      return `url(${stepLY}) no-repeat`;
    }};
    background-size: 100% 100%;
  }
`;

const ItemRightIcon = styled.div`
  width: 9px;
  height: 100%;
  position: absolute;
  right: 1px;
  background: ${props => {
    return `url(${stepR}) no-repeat`;
  }};
  background-size: 100% 100%;
  .seasons-isActive & {
    background: ${props => {
      return `url(${stepRY}) no-repeat`;
    }};
    background-size: 100% 100%;
  }
`;

const ItemMiddle = styled.div`
  display: flex;
  flex-direction: column;
  font-style: italic;
  justify-content: center;
  height: 100%;
  background: ${props => {
    return `url(${stepM}) no-repeat`;
  }};
  background-size: 100% 100%;
  width: 100%;
  color: #399875;
  .seasons-isActive & {
    color: #9e6b2e;
    background: ${props => {
      return `url(${stepMY}) no-repeat`;
    }};
    background-size: 100% 100%;
  }
`;

const LineOne = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 15px;
  text-align: center;
  margin: 3px 0 1px;
  word-break: break-word;
`;
const LineTwo = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 130%;
  text-align: center;
  white-space: nowrap;
  margin: 0 0 7px 0;
`;

const Content = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: rgba(0, 13, 29, 0.68);
  margin: 0 0 4px 0;
  > span > span {
    color: #2dc985;
  }
`;

function RaceSteps() {
  const dispatch = useDispatch();
  const [showNoStartDialog, setShowNoStartDialog] = useState([]);
  const { campaigns, curSelectedSeasonIndex } = useSelector(state => state.cryptoCup);
  const { serverTime } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const seasons = get(campaigns, 'seasons', []);
  const status = campaigns?.status;
  const currentSeasonId = campaigns?.currentSeasonId;
  const campaignId = campaigns?.id;
  const currentSeasonIndex = seasons.findIndex(el => el.id === currentSeasonId);
  const seasonsLength = seasons.length;

  useEffect(
    () => {
      let idx;
      if (currentSeasonIndex >= 0 && status === 2) {
        idx = currentSeasonIndex;
      } else if (status === 3) {
        // 已结束的停留在最后一个
        idx = Math.max(seasonsLength - 1, 0);
      }

      if (!isNil(idx)) {
        dispatch({
          type: 'cryptoCup/update',
          payload: { curSelectedSeasonIndex: idx },
        });
      }
    },
    [currentSeasonId, status, currentSeasonIndex, seasonsLength, dispatch],
  );

  const handleClickTab = (el, index) => {
    if (index === curSelectedSeasonIndex) {
      return;
    }
    if (serverTime < el.preStartTime) {
      setShowNoStartDialog([el.startTime, el.endTime]);
      return;
    }
    // 切换不同赛季tab时，获取报名信息
    if (isLogin) {
      const season = (campaigns?.seasons || [])[index] || {};
      dispatch({
        type: 'cryptoCup/getRegistInfo',
        payload: {
          campaignId,
          seasonIds: [season?.id],
        },
      });
    }
    dispatch({ type: 'cryptoCup/update', payload: { curSelectedSeasonIndex: index } });
  };

  return (
    <Wrapper>
      <>
        {seasons.map((el, index) => {
          return (
            <AntiDuplication key={el.id}>
              <Item
                className={classnames({
                  'seasons-isInProgress': currentSeasonId === el.id,
                  'seasons-isActive': index === curSelectedSeasonIndex,
                })}
                key={el.id}
                onClick={() => {
                  cryptoCupTrackClick(['scheduletab', `${index + 1}`]);
                  handleClickTab(el, index);
                }}
              >
                <ItemLeftIcon />
                <ItemMiddle>
                  <LineOne>{SEASON_TABS[index]?.title?.()}</LineOne>
                  <LineTwo>
                    <>
                      {getUtcZeroTime(el.startTime, 'MM.DD')}-{getUtcZeroTime(el.endTime, 'MM.DD')}
                    </>
                  </LineTwo>
                </ItemMiddle>
                <ItemRightIcon />
              </Item>
            </AntiDuplication>
          );
        })}
      </>
      <CupCommonDialog
        okText={_t('nftInfo.tabs.modalBtn')}
        title={_t('mj1CfDuzkgzgThA47EbqT1')}
        onOk={() => {
          setShowNoStartDialog([]);
        }}
        onCancel={() => {
          setShowNoStartDialog([]);
        }}
        open={showNoStartDialog?.length > 0}
        showCloseX={false}
      >
        <Content>
          <>
            {_tHTML('kA8DCxPmPcC7ozvs2tLDZc', {
              num: `${getUtcZeroTime(showNoStartDialog?.[0], 'MM/DD HH:mm')}-${getUtcZeroTime(
                showNoStartDialog?.[1],
                'MM/DD HH:mm',
              )}`,
            })}
          </>
        </Content>
      </CupCommonDialog>
    </Wrapper>
  );
}

export default RaceSteps;
