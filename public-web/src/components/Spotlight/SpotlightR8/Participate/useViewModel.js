/**
 * Owner: saiya.lee@kupotech.com
 *
 * 活动参与(认购)
 */
import { useLocale } from '@kucoin-base/i18n';
import { numberFormat } from '@kux/mui';
import { divide } from 'helper';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { submitReserve } from 'src/services/spotlight8';
import { _t } from 'tools/i18n';
import { skip2Login } from 'TradeActivity/utils';
import { push } from 'utils/router';
import { EnumStatus } from 'TradeActivityCommon/StatusModal';
import { EVENT_STATUS } from '../constants';

export function useViewModel({ showKycDlg, showDlgTip, showSubscribeDlg }) {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const pageId = useSelector((state) => state.spotlight8.pageData?.id);
  const {
    tokenName,
    token,
    kcsPrices,
    // 服务端返回的活动状态
    status: serverEventStatus,
    currencyList = [],
    campaignId,
    spotlight8PeriodicResponse,
  } = useSelector((state) => state.spotlight8.detailInfo);
  const isLogin = useSelector((state) => state.user.isLogin);

  const {
    // 总订阅人数, null 显示为 --
    totalSubscribers = null,
    // 各个货币申购的总金额
    currencyList: currencySumList,
    // 用户投资统计
    userInvestSummary = null,
  } = useSelector((state) => state.spotlight8.summary || {});

  // 页面倒计时的目标时间, 0表示不显示倒计时(活动结束时使用)
  const [endTime, setEndTime] = useState(0);

  // 活动时间,将后端返回的时间字符串转换为时间戳
  const timeRange = useMemo(
    () => standardizeRange(spotlight8PeriodicResponse),
    [spotlight8PeriodicResponse],
  );
  // 活动时间段, 数组: [预热, 申购, 分发]
  const rangeSegments = useMemo(() => getTimeRangeSegments(timeRange || {}), [timeRange]);
  // 用于触发重新计算活动的状态
  const [reloadStatus, setReloadStatus] = useState(true);
  // 是否预约
  const isBooked = useSelector((state) => state.spotlight8.isBooked);
  // 活动预约状态
  const eventStatus = useSelector((state) => state.spotlight8.eventStatus);
  // 资格信息
  const qualification = useSelector((state) => state.spotlight8.qualification, shallowEqual);
  // 最后一次资格检查的字段
  const lastCheckedField = useRef('');

  // 更新活动状态
  useEffect(() => {
    const eventInfo = getEventStatusInfo(timeRange);
    setEndTime(eventInfo.endTime);
    dispatch({
      type: 'spotlight8/update',
      payload: {
        eventStatus: eventInfo.eventStatus,
      },
    });
  }, [timeRange, reloadStatus, dispatch]);

  // 活动倒计时结束 触发重新计算活动状态
  const onTimeEnd = useCallback(() => {
    setReloadStatus((prev) => !prev);
  }, []);

  // 是否显示申购选项: 未投资, 未进入分发时间段
  const showSubOptions =
    eventStatus === EVENT_STATUS.NOT_START ||
    ((!userInvestSummary || !userInvestSummary.userInvestAmount) &&
      eventStatus < EVENT_STATUS.DISTRIBUTING);

  // 验证是否有操作资格
  const verifyQualification = useCallback(() => {
    // 黑名单国家
    if (!qualification.kycCountryAllow) {
      showDlgTip({
        // 您暂无资格参与此活动
        title: _t('f73c9ad962924000a1d2'),
        // 来自受限区域 xxxx
        text: _t('tc2usK7EXjksnBDqD4Fg3t'),
        status: EnumStatus.Warning,
      });
      return;
    }
    if (!qualification.completedKyc) {
      // 提示完成KYC
      showKycDlg?.();
      lastCheckedField.current = 'completedKyc';
      return false;
    }

    if (!qualification.signedCountryAgreement) {
      lastCheckedField.current = 'signedCountryAgreement';
      // 提示签署国家确认协议
      dispatch({
        type: 'spotlight8/update',
        payload: {
          showBlackListDrawer: true,
        },
      });
      return false;
    }

    if (!qualification.signedAgreement) {
      lastCheckedField.current = 'signedAgreement';
      // 提示签署协议
      dispatch({
        type: 'spotlight8/update',
        payload: {
          showAgreementDrawer: true,
        },
      });
      return false;
    }
    return true;
  }, [qualification, dispatch, showKycDlg, showDlgTip]);

  // 执行预约请求
  const doReserve = useCallback(async () => {
    try {
      const resp = await submitReserve(campaignId);
      if (resp.success) {
        showDlgTip({
          // 预约成功
          title: _t('3042eec1fd354000aff3'),
          // 预约成功, 开始后提醒您
          text: _t('249b631dcfe24000a29c'),
          status: EnumStatus.Success,
        });
        dispatch({
          type: 'spotlight8/update',
          payload: {
            isBooked: true,
          },
        });
      } else {
        dispatch({
          type: 'app/setToast',
          payload: { type: 'error', message: resp.msg },
        });
      }
    } catch (error) {
      dispatch({
        type: 'app/setToast',
        payload: { type: 'error', message: error.message || error.msg },
      });
    }
  }, [campaignId, dispatch, showDlgTip]);

  // 申购区块的操作按钮回调
  const onClickAction = useCallback(() => {
    if (!isLogin) {
      skip2Login();
      return;
    }
    // 未预约且活动未开始
    if (!isBooked && eventStatus === EVENT_STATUS.NOT_START) {
      // 未开始, 预约
      return doReserve();
    }
    // 进行中, 申购
    if (eventStatus === EVENT_STATUS.IN_PROGRESS) {
      if (!verifyQualification()) return;
      showSubscribeDlg?.();
    }
    // 其他情况: 已预约, 分发中, 已结束 不处理
    return;
  }, [eventStatus, isBooked, isLogin, verifyQualification, doReserve, showSubscribeDlg]);

  // 监控资格检查进度, 自动触发下一步操作
  useEffect(() => {
    const lastField = lastCheckedField.current;
    // 置空, 避免重复触发
    lastCheckedField.current = '';
    // 未检查过, 或者资格没确认
    if (!lastField || !qualification || !qualification[lastField]) return;
    // 继续执行操作按钮, 资格未校验通过的继续下一步校验, 校验通过的进行预约/申购操作
    setTimeout(() => {
      onClickAction();
    }, 0);
  }, [qualification, verifyQualification, onClickAction]);

  // 申购币种选项
  const subscriptionOptions = currencyList?.map((item) => {
    let discountRate = item.discountRate;
    if (item.currency === 'KCS') {
      const kcsMax = kcsPrices && kcsPrices.length ? kcsPrices[kcsPrices.length - 1]?.discountRate : 0;
      if (Number(kcsMax) && Number(kcsMax) > 0) {
        discountRate = kcsMax;
      }
    }
    return {
      currency: item.currency,
      // 享受折扣, item.discountRate 为字符串, 可能为 '0.00000', 需转换后判断
      tooltip: Number(discountRate) > 0
      // KCS: 最高享xx折扣, 其他币种: 享xx折扣
        ? _t(item.currency === 'KCS' ? '88093328c36e4800af4c' : 'a33cfedb32b54000addf', {
            discount: numberFormat({
              number: divide(discountRate, 100),
              lang: currentLang,
              options: {
                style: 'percent',
              },
            }),
          })
        : null,
      tokenPrice: numberFormat({
        number: item.tokenPrice,
        lang: currentLang,
      }),
    }
  });

  // 查看申购记录
  const viewSubscribeHistory = useCallback(() => {
    if (!isLogin) {
      skip2Login();
      return;
    }
    push(`/spotlight_r8/purchase-record/${pageId}_${tokenName}`);
  }, [pageId, tokenName, isLogin]);

  // 统计各个币种的申购总量
  const totalSubAmount = useMemo(() => {
    return getCurrencySubSumList(currencyList, currencySumList);
  }, [currencyList, currencySumList]);

  // 是否正在分发中, 仅影响前端预估申购数量的展示, 为 true 展示 待分发
  // 活动在时间在进行中及之后, 但是后端状态还未更新为10(已结束) 且无预估申购数量
  const isDistributing =
    (eventStatus >= EVENT_STATUS.IN_PROGRESS && serverEventStatus !== 10 && userInvestSummary && !userInvestSummary.rewardAmount);
  // 预估申购数量, isDistributing 为 false 时使用, null 显示为 --
  const estSubscriptionAmount = userInvestSummary ? (userInvestSummary.rewardAmount || 0) : null;
  // 用户实际投资的数量, 分发结束后展示
  const actualInvestAmount = userInvestSummary ? (userInvestSummary.actualInvestAmount || 0) : null;
  // 用户投资的币种信息
  const investedCurrency = useMemo(() => {
    if (!currencySumList || !currencySumList.length || !userInvestSummary || !currencyList) return null;
    const investedCoin = currencySumList.find((item) => {
      return item.currency === userInvestSummary.userInvestCurrency;
    });
    if (!investedCoin) return null;
    const userCoin = currencyList.find((item) => item.currency === userInvestSummary.userInvestCurrency);
    if (!userCoin) return investedCoin;
    return {
      ...investedCoin,
      hasDiscount: userCoin.hasDiscount,
      discountRate: userCoin.discountRate,
    }
  }, [currencySumList, userInvestSummary, currencyList])

  return {
    token,
    isBooked,
    totalSubscribers,
    totalSubAmount,
    eventStatus,
    endTime,
    userInvestSummary,
    currentLang,
    showSubOptions,
    onClickAction,
    subscriptionOptions,
    rangeSegments,
    viewSubscribeHistory,
    isDistributing,
    // 预估申购数量
    estSubscriptionAmount,
    actualInvestAmount,
    investedCurrency,
    onTimeEnd,
  };
}

function getTimeRangeSegments(spotlight8Range) {
  // 时间默认为0, 避免前端报错, 正常情况下不会出现该情况
  return [
    {
      // 预约时间段
      title: _t('f0181423321c4000abfd'),
      startDate: spotlight8Range.bookStartTime || 0,
      endDate: spotlight8Range.bookEndTime || 0,
      status: EVENT_STATUS.NOT_START,
    },
    {
      // 申购时间段
      title: _t('717a75c1153d4000a455'),
      startDate: spotlight8Range.subStartTime || 0,
      endDate: spotlight8Range.subEndTime || 0,
      status: EVENT_STATUS.IN_PROGRESS,
    },
    {
      // 分发时间段
      title: _t('5a1e831aeeb64000a8e3'),
      startDate: spotlight8Range.distributeStartTime || 0,
      endDate: spotlight8Range.distributeEndTime || 0,
      status: EVENT_STATUS.DISTRIBUTING,
    },
  ];
}

// 合并计算各个币种的申购总量
function getCurrencySubSumList(currencyList, currencySumList) {
  if (!currencyList || !currencyList.length) return null;
  return currencyList.map((item) => {
    const currency = item.currency;
    const currencySum = currencySumList?.find((item) => item.currency === currency);
    if (!currencySum) {
      return {
        currency,
        // 前端显示 --
        total: null,
      };
    }
    return {
      currency,
      total: currencySum.totalAmount,
    };
  });
}

/**
 * 计算活动状态
 */
export function getEventStatusInfo(spotlight8Range) {
  const now = Date.now();
  // 找不到未开始的时间段, 则活动已结束
  if (!spotlight8Range || now >= spotlight8Range.distributeEndTime) {
    return {
      eventStatus: EVENT_STATUS.ENDED,
      endTime: 0,
    };
  }

  if (now < spotlight8Range.bookEndTime) {
    // 活动未开始
    return {
      eventStatus: EVENT_STATUS.NOT_START,
      endTime: spotlight8Range.bookEndTime,
    };
  }

  if (now < spotlight8Range.subEndTime) {
    // 活动进行中
    return {
      eventStatus: EVENT_STATUS.IN_PROGRESS,
      endTime: spotlight8Range.subEndTime,
    };
  }

  if (now < spotlight8Range.distributeEndTime) {
    // 活动分发中
    return {
      eventStatus: EVENT_STATUS.DISTRIBUTING,
      endTime: spotlight8Range.distributeEndTime,
    };
  }
  // 活动已结束
  return {
    eventStatus: EVENT_STATUS.ENDED,
    endTime: 0,
  };
}

export function standardizeRange(timeRange) {
  if (!timeRange) return null;
  return Object.keys(timeRange).reduce((acc, key) => {
    acc[key] = new Date(timeRange[key]).getTime();
    return acc;
  }, {});
}
