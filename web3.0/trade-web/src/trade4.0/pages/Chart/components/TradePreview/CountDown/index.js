/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-10-05 22:20:26
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-01-08 18:25:24
 * @FilePath: /trade-web/src/trade4.0/pages/Chart/components/TradePreview/CountDown/index.js
 * @Description:
 */
/**
 * Owner: jessie@kupotech.com
 */
import { intlFormatDate } from '@/hooks/common/useIntlFormat';
import { useBoxCount } from '@/pages/Chart/hooks/useBoxCount';
import storage from '@/pages/Chart/utils/index';
import { getSymbolAuctionInfo } from '@/utils/business';
import { siteCfg } from 'config';
import { useDispatch, useSelector } from 'dva';
import { filter } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { trackClick } from 'utils/ga';
import { _t, _tHTML } from 'utils/lang';
import { CountDownWrapper, DateText, Subscribe } from './style';
import TimeOut from './TimeOut';

const { MAINSITE_HOST } = siteCfg;

const hiddenProperty =
  'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
    ? 'webkitHidden'
    : 'mozHidden' in document
    ? 'mozHidden'
    : '';
const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

const CountDown = ({ symbolInfo, symbol }) => {
  const { baseCurrency, quoteCurrency } = symbolInfo;
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );

  const { previewTime, previewRemainSecond, isAuctionEnabled } = getSymbolAuctionInfo(
    symbolInfo,
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );
  const dispatch = useDispatch();
  const { boxCount } = useBoxCount();
  const recentActive = useSelector((state) => state.tradeMarkets.recentActive);

  // 获取倒计时
  const getCountDown = useCallback(() => {
    dispatch({ type: 'symbols/pullSymbols' });
  }, [dispatch, previewTime]);

  useEffect(() => {
    getCountDown();
    dispatch({ type: 'tradeMarkets/pullRecentActive' });
    // 监听页面显示
    if (!visibilityChangeEvent || !hiddenProperty) {
      return;
    }
    const onVisibilityChange = () => {
      if (!document[hiddenProperty]) {
        // 每次显示页面都刷新倒计时
        getCountDown();
      }
    };
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    return () => {
      document.removeEventListener(visibilityChangeEvent, onVisibilityChange);
    };
  }, [dispatch, getCountDown]);

  const handleSubscribe = () => {
    trackClick(['previewSubButton', '1'], { symbol });
    storage.setItem('new-cryptocurrencies-subscribe', baseCurrency, 'kc');
  };

  const multiMarkClassName = useMemo(() => {
    if (boxCount === '4') {
      return 'multiMarkClassName';
    }
    return '';
  }, [boxCount]);

  const isNewCurrency = useMemo(() => {
    const activeGroup = filter(recentActive, (item) => {
      if (item.isAllowBook && item.currency === baseCurrency) {
        return true;
      } else {
        return false;
      }
    });
    return activeGroup.length > 0;
  }, [recentActive, baseCurrency]);

  return (
    <CountDownWrapper>
      <DateText className={multiMarkClassName}>
        {isAuctionEnabled ? `${_t('h8YFzR7NzhYZptaXmctzHm')} ` : `${_t('71WvPzwwyNfMnBq8gUwmSV')} `}
        {`${intlFormatDate({ date: previewTime, options: { timeZone: 'UTC' } })} (UTC)`}
      </DateText>
      <TimeOut
        totalMS={previewRemainSecond}
        finish={() => {
          getCountDown();
        }}
      />
      {/* 仅对USDT上新币对开放预约入口 */}
      {quoteCurrency === 'USDT' && isNewCurrency && (
        <Subscribe onClick={handleSubscribe} className={multiMarkClassName}>
          {_tHTML('new.currency.subscribe.tip', {
            newCurrencyLink: `${MAINSITE_HOST}/markets/new-cryptocurrencies`,
          })}
        </Subscribe>
      )}
    </CountDownWrapper>
  );
};
export default CountDown;
