/**
 * Owner: tom@kupotech.com
 */

import React, { useState, useCallback, useEffect } from 'react';
import { get, throttle } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { styled } from '@kufox/mui/emotion';
import AntiDuplication from 'components/common/AntiDuplication';
import { _t } from 'utils/lang';
import { useLogin } from 'src/hooks';
import Match from './Match';
import MatchDownTime from './MatchDownTime';
import CurrentPrize from '../CurrentPrize';
import TotalPrize from '../TotalPrize';
import EarnPoints from '../Points/EarnPoints';
import PointsList from '../Points/PointsList';
import MatchArenaModal from '../MatchArenaModal/List';
import Toast from '../common/Toast';
import CupCommonDialog from '../common/CupCommonDialog';
import useGetSelectedSeason from '../hooks/useGetSelectedSeason';
import { cryptoCupTrackClick, getAppLoginParams } from '../config';
import tabSvg from 'assets/cryptoCup/match-tab.svg';
import subSvg from 'assets/cryptoCup/match-sub.svg';
import subedSvg from 'assets/cryptoCup/match-subed.svg';
import rightArrow from 'assets/cryptoCup/match-arrow-right.svg';

const Wrapper = styled.div``;

const TabsBox = styled.div`
  padding: 4px 4px;
  background: #e9feed;
  border: 1px solid #88dd98;
  border-radius: 90px;
  display: flex;
`;

const MatchTab = styled.div`
  cursor: pointer;
  width: 50%;
  height: 30px;
  font-weight: 700;
  font-size: 16px;
  color: #399875;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props =>
    props.actived &&
    `
    color: ${props.theme.colors.text};
    border-radius: 90px;
    background: url(${tabSvg}) right top no-repeat #75fbaf;
  `}
`;

const SubBox = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
`;

const EndText = styled.div`
  font-size: 10px;
  color: #2dc985;
`;

const Subscribe = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  color: ${props => (props.isSub ? 'rgba(0, 13, 29, 0.4)' : '#2dc985')};
`;

const SubIcon = styled.img`
  width: 10px;
  margin-right: 6px;
`;

const OtherMatch = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const OtherMatchText = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  color: #2dc985;
  &::after {
    display: block;
    content: '';
    width: 10px;
    height: 10px;
    background: url(${rightArrow}) no-repeat;
    background-size: 100% 100%;
    margin: 0 0 0 2px;
  }
`;

function MatchScore() {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  const { campaigns, isSubscribe } = useSelector(state => state.cryptoCup);
  const [tabKey, setTabKey] = useState(0);
  const [showOtherMatch, setShowOtherMatch] = useState(false);
  const [subVisible, setSubVisible] = useState(false);

  const { handleLogin } = useLogin();
  const { season, curSelectedSeasonIndex, seasonId } = useGetSelectedSeason();
  // 活动id
  const campaignId = get(campaigns, 'id', undefined);

  useEffect(
    () => {
      if (season?.status === 2 && isLogin) {
        dispatch({
          type: 'cryptoCup/getMyScore',
          payload: { seasonId },
        });
      }
    },
    [season, seasonId, isLogin, dispatch],
  );

  // 订阅比赛弹窗
  const handleSubscribe = useCallback(
    throttle(() => {
      // 未登陆
      if (!isLogin) {
        handleLogin(getAppLoginParams());
        return;
      }
      // 已订阅
      if (isSubscribe) {
        return;
      }
      cryptoCupTrackClick(['subscribe', '1']);
      setSubVisible(true);
    }, 1000),
    [isSubscribe, isLogin],
  );
  // 订阅比赛
  const submitSubscribe = useCallback(
    throttle(() => {
      dispatch({
        type: 'cryptoCup/uploadBehavior',
        payload: {
          campaignId,
          event: 2,
        },
      }).then(res => {
        if (res) {
          setSubVisible(false);
          Toast(_t('cryptoCup.subscribe.success'));
          dispatch({
            type: 'cryptoCup/getBehavior',
            payload: {
              campaignId,
              event: 2,
            },
          });
        }
      });
    }, 1000),
    [dispatch, campaignId],
  );

  return (
    <Wrapper>
      <TabsBox>
        <AntiDuplication>
          <MatchTab
            actived={tabKey === 0}
            onClick={() => {
              setTabKey(0);
              dispatch({ type: 'app/getServerTime' });
              cryptoCupTrackClick(['tab', '1']);
            }}
          >
            {_t('cryptoCup.match.tab1')}
          </MatchTab>
        </AntiDuplication>
        <AntiDuplication>
          <MatchTab
            actived={tabKey === 1}
            onClick={() => {
              setTabKey(1);
              cryptoCupTrackClick(['tab', '2']);
            }}
          >
            {_t('cryptoCup.match.tab2')}
          </MatchTab>
        </AntiDuplication>
      </TabsBox>

      <>
        {tabKey === 0 ? (
          <>
            <SubBox>
              <>{season?.status === 2 ? <MatchDownTime /> : null}</>
              <>
                {season?.status === 3 ? <EndText>{_t('pejj1UEzK3S9htPMKGMJQm')}</EndText> : <div />}
              </>
              <AntiDuplication>
                <Subscribe isSub={isSubscribe} onClick={handleSubscribe}>
                  <SubIcon src={isSubscribe ? subedSvg : subSvg} alt="" />
                  <span>
                    {isSubscribe ? _t('cryptoCup.subscribed') : _t('cryptoCup.subscribe')}
                  </span>
                </Subscribe>
              </AntiDuplication>
            </SubBox>

            <Match />

            {curSelectedSeasonIndex === 3 ? null : (
              <OtherMatch>
                <AntiDuplication>
                  <OtherMatchText
                    onClick={() => {
                      setShowOtherMatch(true);
                      cryptoCupTrackClick(['match', '1']);
                    }}
                  >
                    {_t('cryptoCup.match.other')}
                  </OtherMatchText>
                </AntiDuplication>
              </OtherMatch>
            )}

            {[1, 2].includes(season?.status) ? <EarnPoints /> : null}
            <PointsList />

            {showOtherMatch && <MatchArenaModal onClose={() => setShowOtherMatch(false)} />}

            <CupCommonDialog
              okText={_t('cryptoCup.subscribe.open')}
              title={_t('cryptoCup.subscribe.remind')}
              onOk={submitSubscribe}
              showCancelText={_t('1L716BwQbjgeLsb9KiX9cb')}
              onCancel={() => setSubVisible(false)}
              showCloseX={false}
              open={subVisible}
            >
              {_t('cryptoCup.subscribe.info')}
            </CupCommonDialog>
          </>
        ) : null}
      </>

      <>
        {tabKey === 1 ? (
          <>
            {curSelectedSeasonIndex === 3 ? null : <CurrentPrize />}
            <TotalPrize />
          </>
        ) : null}
      </>
    </Wrapper>
  );
}

export default MatchScore;
