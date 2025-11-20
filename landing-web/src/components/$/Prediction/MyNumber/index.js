/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'dva';
import { map } from 'lodash';
import moment from 'moment';
import { px2rem } from '@kufox/mui/utils';
import { styled } from '@kufox/mui/emotion';
import { _t, _tHTML } from 'utils/lang';
import { sensors } from 'utils/sensors';
import { getUtcZeroTime } from '../selector';
import { DIALOG_TYPE, THEME_COLOR } from '../config';

import TipIcon from 'assets/global/tip.svg';
import ArrowRight from 'assets/prediction/arrow-right.svg';
import Ornament from 'assets/prediction/ornament.svg';
import LockIcon from 'assets/prediction/lock.svg';
import UnlockIcon from 'assets/prediction/unlock.svg';
import WinIcon from 'assets/prediction/win.svg';
import NoContent from 'assets/global/noContent.svg';
import WrappedSpin from '../WrappedSpin';


const NUMBER_CARD = {
  lock: {
    bc: '#fff, #fff',
    opacity: 0.4,
    color: '#ccd0d4',
    numberColor: '#00142A',
    timeColor: '#00142A',
    flagBc: '#ccd0d4',
    flagIcon: LockIcon,
    desc: () => _t('prediction.unActive'),
  },
  big_award: {
    bc: '#FFFDEF, #FFEBB8',
    opacity: 1,
    color: '#FFB547',
    numberColor: '#FFA725',
    timeColor: '#00142A',
    flagBc: '#FFB547',
    flagIcon: WinIcon,
    desc: () => _t('prediction.bigestPrize'),
  },
  sunshine_award: {
    bc: '#FDFAFF, #F7E6FF',
    opacity: 1,
    color: '#C7ADFF',
    numberColor: THEME_COLOR.primary,
    timeColor: '#00142A',
    flagBc: THEME_COLOR.primary,
    flagIcon: WinIcon,
    desc: () => _t('prediction.luckyPrize'),
  },
  unlock: {
    bc: '#fff, #fff',
    opacity: 1,
    color: '#C7ADFF',
    numberColor: THEME_COLOR.primary,
    timeColor: '#00142A',
    flagBc: THEME_COLOR.primary,
    flagIcon: UnlockIcon,
    desc: () => _t('prediction.active'),
  },
};

// --- 样式 start ---
const Font = styled.span`
  font-size: ${px2rem(14)};
  line-height: ${px2rem(22)};
  color: rgba(0, 20, 42, 0.3);
  a {
    text-decoration: underline;
  }
`;
const SmallText = styled.div`
  font-size: ${px2rem(12)};
  line-height: ${px2rem(20)};
`;
const XSmallText = styled.div`
  font-size: ${px2rem(10)};
  line-height: ${px2rem(16)};
`;
const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.section`
  width: 100%;
  padding: 0 ${px2rem(12)};
  margin-top: ${px2rem(24)};
  margin-bottom: ${px2rem(12)};
`;
const Title = styled.div`
  display: flex;
  font-weight: 700;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(26)};
  color: #00142a;
  align-items: center;
  img {
    width: ${px2rem(14)};
    margin-left: ${px2rem(5)};
    cursor: pointer;
  }
`;
const NoLogin = styled(CenterBox)`
  height: ${px2rem(200)};
  font-size: ${px2rem(12)};
  color: rgba(0, 20, 42, 0.6);
  a {
    color: ${THEME_COLOR.primary};
    line-height: ${px2rem(10)};
    margin-left: ${px2rem(2)};
    border-bottom: ${px2rem(1)} solid ${THEME_COLOR.primary};
  }
`;
const TradeGuide = styled.div`
  display: flex;
`;
const GuideText = styled.div`
  flex: 1;
`;
const LightText = styled(SmallText)`
  color: rgba(0, 20, 42, 0.4);
  max-width: ${px2rem(210)};
  .highlight {
    color: ${THEME_COLOR.primary};
    font-weight: 700;
    font-size: ${px2rem(16)};
  }
  .decorate {
    position: relative;
    z-index: 1;
    ::after {
      content: '';
      position: absolute;
      z-index: -1;
      bottom: ${px2rem(-1)};
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(90deg, #F7E7FF 0%, #F7E7FF 100%);
    }
  }
`;
const Highlight = styled.span`
  font-weight:600;
  color: ${THEME_COLOR.primary};
`;
const Black = styled.span`
  color: rgba(0, 20, 42, 1);
`;
const ButtonBox = styled.div`
  color: #fff;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
`;
const TradeButton = styled(CenterBox)`
  background: ${THEME_COLOR.primary};
  width: ${px2rem(124)};
  height: ${px2rem(40)};
  font-size: ${px2rem(16)};
  border-radius: ${px2rem(45)};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  img {
    width: ${px2rem(12)};
    margin-left: ${px2rem(6)};
  }
`;
const Tooltip = styled(SmallText)`
  width: 100%;
  position: absolute;
  bottom: ${px2rem(42)};
  right: 0;
  background: #191e29;
  border-radius: ${px2rem(8)};
  padding: ${px2rem(2)} ${px2rem(8)};
  .highlight {
    color: ${THEME_COLOR.primary};
  }
  ::after {
    content: '';
    position: absolute;
    top: 100%;
    right: ${px2rem(20)};
    border: ${px2rem(7)} solid transparent;
    border-top-color: #191e29;
    margin-top: ${px2rem(-1)};
  }
`;
const Records = styled.div`
  padding-top: ${px2rem(24)};
  min-height: ${px2rem(250)};
  border-radius: ${px2rem(8)};
  margin-top: ${px2rem(12)};
  border: ${px2rem(1)} solid #00142a;
  position: relative;
  background: url(${Ornament}) 0 0 no-repeat;
`;
const Guessing = styled(XSmallText)`
  top: 0;
  right: 0;
  position: absolute;
  height: ${px2rem(24)};
  color: rgba(0, 20, 42, 0.6);
  background: rgba(0, 20, 42, 0.04);
  padding: ${px2rem(4)} ${px2rem(10)};
  border-bottom-left-radius: ${px2rem(8)};
  word-break: keep-all;
`;
const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${px2rem(12)} ${px2rem(12)};
`;
const Item = styled.div`
  width: 48%;
  position: relative;
  overflow: hidden;
  text-align: center;
  height: ${px2rem(70)};
  margin-bottom: ${px2rem(12)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${px2rem(8)};
  cursor: ${props => (props.canOpt ? 'pointer' : 'default')};
`;
const Flag = styled(CenterBox)`
  top: 0;
  left: 0;
  z-index: 2;
  position: absolute;
  width: ${px2rem(28)};
  height: ${px2rem(16)};
  border-bottom-right-radius: ${px2rem(8)};
  border-top-left-radius: ${px2rem(8)};
  background: ${props => NUMBER_CARD[props.statusCode]?.flagBc};
`;
const Number = styled(Font)`
  font-weight: 700;
  color: ${props => NUMBER_CARD[props.statusCode]?.numberColor};
`;
const Time = styled(XSmallText)`
  color: ${props => NUMBER_CARD[props.statusCode]?.timeColor};
`;
const InfoText = styled(XSmallText)`
  color: rgba(0, 20, 42, 0.6);
`;
const NoDataWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: ${px2rem(40)};
  img {
    width: ${px2rem(100)};
  }
  a {
    color: ${THEME_COLOR.primary};
  }
`;

const Wrap = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  text-align: center;
  height: ${px2rem(70)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${px2rem(1)} solid ${props => NUMBER_CARD[props.statusCode]?.color};
  opacity: ${props => NUMBER_CARD[props.statusCode]?.opacity};
  background-image: linear-gradient(to bottom, ${props => NUMBER_CARD[props.statusCode]?.bc});
  cursor: ${props => (props.canOpt ? 'pointer' : 'default')};
  border-radius: ${px2rem(8)};
`;
// --- 样式 end ---

const MyNumber = ({ onShowTipDialog }) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  const { activityConfig, userGuessInfo, currentRound, currentRoundIndex } = useSelector(
    state => state.prediction,
  );
  const loading = useSelector(state => state.loading.effects['prediction/pullUserGuessList']);

  const { id: activityId, inProcessing, end } = currentRound;
  const { guessLimit = 0, spotAmount = 0, futureAmount = 0 } = activityConfig;
  const { submitted, [activityId]: dataById } = userGuessInfo;
  const { userGuessRecords = [] } = dataById || {};
  const { currentLang } = useSelector(state => state.app);

  const showTradeNowBtn = inProcessing && submitted; // 黑底提示，只在进行中场次，且用户历史已经提交过号码后就展示

  const date = moment.utc(end).format('YYYY-MM-DD');
  // 显示modal
  const onShowDialog = useCallback(
    () => {
      // 埋点
      sensors.trackClick(['Trade', '1'], {
        language: currentLang,
        Sessions: `${date}/${currentRoundIndex + 1}`,
      });
      dispatch({
        type: 'prediction/update',
        payload: {
          showTradeDialog: true,
        },
      });
    },
    [dispatch, currentLang, date, currentRoundIndex],
  );

  // 点击竞猜号码
  const clickNumberItem = useCallback(
    canOpt => {
      canOpt && onShowDialog();
    },
    [onShowDialog],
  );

  return (
    <Wrapper>
      <Title>
        <Fragment>{_t('prediction.myNumber')}</Fragment>
        <img onClick={() => onShowTipDialog(DIALOG_TYPE.TRADE_TIP)} src={TipIcon} alt="" />
      </Title>
      <Fragment>
        {isLogin ? (
          <Fragment>
            <Fragment>
              {!!submitted ? (
                <TradeGuide>
                  <GuideText>
                    <LightText>
                      {_tHTML('prediction.tradeAmoutTip', { a: spotAmount, b: futureAmount })}
                    </LightText>
                  </GuideText>
                  <ButtonBox>
                    <TradeButton
                      disabled={!inProcessing}
                      {...(inProcessing ? { onClick: onShowDialog } : {})}
                    >
                      <Fragment>{_t('prediction.tradeBtn')}</Fragment>
                      <img src={ArrowRight} alt="" />
                    </TradeButton>
                    <Fragment>
                      {!!showTradeNowBtn ? (
                        <Tooltip>{_tHTML('prediction.tradebtnTip')}</Tooltip>
                      ) : (
                        ''
                      )}
                    </Fragment>
                  </ButtonBox>
                </TradeGuide>
              ) : (
                ''
              )}
            </Fragment>
            <Records>
              <Guessing>
                <Fragment> {_t('prediction.subimtted')}</Fragment>{' '}
                <Highlight>{userGuessRecords.length}</Highlight>/<Black>{guessLimit}</Black>
              </Guessing>
              <WrappedSpin spinning={!!loading}>
                <List>
                  {userGuessRecords.length ? (
                    map(userGuessRecords, item => {
                      const {
                        id,
                        guessNum,
                        createdAt,
                        isEffective,
                        isWinning,
                        rewordSource,
                      } = item;
                      const _createAt = getUtcZeroTime(createdAt, 'HH:mm:ss');
                      let statusCode;
                      if (!isEffective) {
                        statusCode = 'lock';
                      } else if (isWinning) {
                        statusCode = rewordSource;
                      } else {
                        statusCode = 'unlock';
                      }
                      const { flagIcon, desc } = NUMBER_CARD[statusCode] || {};
                      // 可以展示交易弹窗为 当前场次进行中且竞猜号码处于未激活状态
                      const canOpt = inProcessing && !isEffective;
                      return (
                        <Item
                          canOpt={canOpt}
                          statusCode={statusCode}
                          key={id}
                          onClick={() => clickNumberItem(canOpt)}
                        >
                          <Fragment>
                            {!!flagIcon ? (
                              <Flag statusCode={statusCode}>
                                <img src={flagIcon} alt="" />
                              </Flag>
                            ) : (
                              ''
                            )}
                          </Fragment>
                          <Wrap canOpt={canOpt}
                            statusCode={statusCode}
                            key={id}>


                            <Number statusCode={statusCode}>{guessNum}</Number>
                            <Time statusCode={statusCode}>{_createAt}</Time>
                            <Fragment>{!!desc ? <InfoText>{desc()}</InfoText> : ''}</Fragment>
                          </Wrap>

                        </Item>
                      );
                    })
                  ) : (
                    <NoDataWrapper>
                      <img src={NoContent} alt="" />
                      <br />
                      <Font>{_t('prediction.noSubmit')}</Font>
                    </NoDataWrapper>
                  )}
                </List>
              </WrappedSpin>
            </Records>
          </Fragment>
        ) : (
          <Records>
            <NoDataWrapper>
              <img src={NoContent} alt="" />
              <br />
              <Font>{_tHTML('prediction.loginTip')}</Font>
            </NoDataWrapper>
          </Records>
        )}
      </Fragment>
    </Wrapper>
  );
};

export default MyNumber;
