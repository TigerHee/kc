/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useMemo, useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { Button } from '@kufox/mui';
import CoinIcon from 'components/common/KcCoinIcon';
import CoinCodeToName from 'components/common/CoinCodeToName';
import CountDown from 'components/$/Recall/QuestDetail/CountDown';
import Progress from 'components/$/Recall/QuestDetail/Progress';
import TipsBar from 'components/$/Recall/QuestDetail/TipsBar';
import completeAllImg from 'assets/recall/complete_all.svg';
import { _t, addLangToPath } from 'utils/lang';
import { useSelector } from 'dva';
import { KUCOIN_HOST } from 'utils/siteConfig';
import JsBridge from 'utils/jsBridge';
import { recallStageStatus, formatNumber } from 'components/$/Recall/config';
import { kcsensorsClick, saTrackForBiz } from 'utils/ga';
import { cloneDeep } from 'lodash';

const DetailWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.base};
  border-top-left-radius: ${px2rem(12)};
  border-top-right-radius: ${px2rem(12)};
  padding: ${px2rem(20)} ${px2rem(24)} ${px2rem(16)};
`;
const Obtained = styled.div`
  font-size: ${px2rem(12)};
  line-height: ${px2rem(16)};
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: ${px2rem(4)};
`;

const Title = styled.h3`
  margin-top: ${px2rem(4)};
  margin-bottom: ${px2rem(28)};
  font-weight: 400;
  text-align: center;
  font-size: ${px2rem(14)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
`;

const AmountBox = styled.div`
  height: ${px2rem(44)};
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    margin-top: ${px2rem(8)};
  }
`;
const Number = styled.span`
  font-weight: 600;
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 ${px2rem(6)};
`;
const Name = styled.span`
  font-weight: 400;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(20)};
  color: ${({ theme }) => theme.colors.text60};
  margin-top: ${px2rem(8)};
`;

const ExtendSuccessTipsBar = styled(TipsBar)`
  margin: ${px2rem(36)} 0 ${px2rem(20)};
`;
const ExtendErrorTipsBar = styled(TipsBar)`
  margin: ${px2rem(34)} 0 ${px2rem(32)};
  > div {
    padding: ${px2rem(3)} ${px2rem(10)} ${px2rem(4)};
  }
`;

const Tips = styled.div`
  font-size: ${px2rem(14)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: ${px2rem(24)};
  text-align: center;
`;

const WithdrawButton = styled(Button)`
  background: linear-gradient(360deg, #ffc759 0%, #ffa455 22.89%, #ffb947 115%);
  border: ${px2rem(1)} solid #8e5c2d;
  color: ${({ theme }) => theme.colors.text60};
  border-radius: ${px2rem(4)};
  &:hover {
    background: linear-gradient(360deg, #ffc759 0%, #ffa455 22.89%, #ffb947 115%);
  }
`;

const CompleteImg = styled.img`
  height: ${px2rem(180)};
  display: block;
  margin: ${px2rem(14)} auto ${px2rem(20)};
`;

const CompleteDesc = styled.p`
  font-size: ${px2rem(18)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  padding: 0 ${px2rem(12)};
  text-align: center;
  margin: 0 auto ${px2rem(32)};
`;

const QuestDetail = ({ handleWithdraw, style }) => {
  const { generalInfo, currentStageInfo } = useSelector((state) => state.userRecall);
  const { isInApp } = useSelector((state) => state.app);
  const withdrawLoading = useSelector(
    (state) => state.loading.effects[`userRecall/recallWithdraw`],
  );
  const { bonusAmount, targetTradeAmount, tradeAmountSnapshot, status } = currentStageInfo || {};
  const handleGoToTrade = (blockKey, data = {}) => {
    try {
      kcsensorsClick([blockKey, '1'], {
        optionKey,
        ...data,
      });
    } catch (e) {
      console.log('e', e);
    }
    if (isInApp) {
      JsBridge.open({ type: 'jump', params: { url: '/quotes?type=0' } });
    } else {
      window.location.href = addLangToPath(`${KUCOIN_HOST}/markets/favorite`);
    }
  };
  const { currency: activityCurrency } = generalInfo;

  const countDownRef = useRef();
  //倒计时剩余时间/h
  const loadingTime = useMemo(() => {
    if (countDownRef?.current) {
      return (
        countDownRef?.current.duration.hours +
        (countDownRef?.current.duration.minutes / 60).toFixed(1) * 1
      );
    }
    return 0;
  }, [countDownRef.current]);

  //埋点，所有阶段目标交易额&最低奖金信息拼接，如：1000,4000,10000&1,2.5,3.5
  const optionKey = useMemo(() => {
    let targetAmount = '',
      minBonusAmount = '',
      list = cloneDeep(generalInfo?.userRecallConfigs) || [];
    list.map((item) => {
      targetAmount = targetAmount ? targetAmount + ',' + item?.targetAmount : item?.targetAmount;
      minBonusAmount = minBonusAmount ? minBonusAmount + ',' + item?.leastBonus : item?.leastBonus;
    });
    return targetAmount + '&' + minBonusAmount;
  }, [generalInfo]);

  const onClickWithdrawButton = () => {
    try {
      kcsensorsClick(['completeTask', '1'], {
        optionKey,
        allItemAmount: generalInfo?.curStageOrder, //所属阶段
        clickPosition: 'withdraw',
      });
    } catch (e) {
      console.log('e', e);
    }
    handleWithdraw && handleWithdraw();
  };
  const onClickTipsBar = () => {
    try {
      kcsensorsClick(['completeTask', '1'], {
        optionKey,
        allItemAmount: generalInfo?.curStageOrder, //所属阶段
        clickPosition: 'greenTip',
      });
    } catch (e) {
      console.log('e', e);
    }
    handleWithdraw();
  };

  useEffect(() => {
    if (
      generalInfo?.curStageOrder === generalInfo.totalStages &&
      status === recallStageStatus.SUCCESS
    ) {
      try {
        saTrackForBiz({}, ['allComplete', '1'], {
          optionKey,
        });
      } catch (e) {
        console.log('e', e);
      }
    }
  }, [generalInfo, status]);
  useEffect(() => {
    if (status === recallStageStatus.FAIL) {
      try {
        saTrackForBiz({}, ['fail', '1'], {
          optionKey,
          allItemAmount: generalInfo?.curStageOrder, //所属阶段
        });
      } catch (e) {
        console.log('e', e);
      }
    } else if (status === recallStageStatus.WAIT_WITHDRAW) {
      try {
        saTrackForBiz({}, ['completeTask', '1'], {
          optionKey,
          allItemAmount: generalInfo?.curStageOrder, //所属阶段
          clickPosition: '',
        });
      } catch (e) {
        console.log('e', e);
      }
    }
  }, [status]);
  // 当前是最后一轮，且已提现完成，则显示完成页面
  return generalInfo?.curStageOrder === generalInfo.totalStages &&
    status === recallStageStatus.SUCCESS ? (
    <DetailWrapper style={style}>
      <CompleteImg src={completeAllImg} />
      <CompleteDesc>
        {_t('bnQ8o7Ub64sCQEhJhR71aW', {
          number: formatNumber(generalInfo?.withdrawnAmount),
          currency: activityCurrency,
        })}
      </CompleteDesc>
      <Button
        fullWidth
        onClick={() => {
          handleGoToTrade('allComplete');
        }}
      >
        {_t('3b5egMLGeHw7pxgoumdqTi')}
      </Button>
    </DetailWrapper>
  ) : (
    <DetailWrapper style={style}>
      {+generalInfo?.withdrawnAmount ? (
        <Obtained>
          {_t('eExUJkc1t8WsEwKSbh7d9N', {
            number: formatNumber(generalInfo?.withdrawnAmount),

            currency: activityCurrency,
          })}
        </Obtained>
      ) : null}
      <Title>{_t('dwyJN9mi3vwbMFrpDhJyab')}</Title>
      <AmountBox>
        <CoinIcon size={24} currency={activityCurrency} showName={false} />
        <Number>{formatNumber(bonusAmount) || '--'}</Number>
        <Name>
          <CoinCodeToName coin={activityCurrency} />
        </Name>
      </AmountBox>
      {status === recallStageStatus.WAIT_QUEST_COMPLETE ? (
        <>
          <CountDown target={formatNumber(targetTradeAmount)} ref={countDownRef} />
          <Button
            fullWidth
            onClick={() => {
              handleGoToTrade('ongoingTask', {
                allItemAmount: generalInfo?.curStageOrder, //所属阶段
                loadingTime,
                intervals: Math.min(
                  formatNumber(tradeAmountSnapshot),
                  formatNumber(targetTradeAmount),
                ),
              });
            }}
          >
            {_t('qhGSD3QrK6scfgBdsinf75')}
          </Button>
        </>
      ) : status === recallStageStatus.WAIT_WITHDRAW ? (
        <>
          <ExtendSuccessTipsBar
            text={_t('fmX2viqeYQqSK5qymK3uXu')}
            type="success"
            onClick={onClickTipsBar}
          />
          <Tips>{_t('ikL12AcdHvbwBipgj8N2j6')}</Tips>
          <WithdrawButton fullWidth onClick={onClickWithdrawButton} loading={withdrawLoading}>
            {_t('94eXhBxuXn14kiHMF2h3Nx')}
          </WithdrawButton>
        </>
      ) : status === recallStageStatus.FAIL ? (
        <>
          <ExtendErrorTipsBar text={_t('cmK7m1kRnSbGZyzjZW217n')} type="error" />
        </>
      ) : null}
      {+targetTradeAmount > 0 ? (
        <Progress
          optionKey={optionKey}
          loadingTime={loadingTime}
          current={tradeAmountSnapshot}
          target={targetTradeAmount}
          expire={status === recallStageStatus.FAIL}
        />
      ) : null}
    </DetailWrapper>
  );
};

export default QuestDetail;
