/*
 * @Date: 2024-05-28 16:35:25
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-05 21:01:39
 */
/**
 * Owner: harry.lai@kupotech.com
 */
import React, { memo } from 'react';
import { SPOT } from 'src/trade4.0/meta/const';
import { useEtfCoin } from 'utils/hooks';
// eslint-disable-next-line max-len
import MultiTypeOrderHistoryFilterBar from '@/pages/Orders/Common/OrderListCommon/MultiTypeOrderHistoryFilterBar';
import FiltersBar from '@/pages/Orders/Common/OrderListCommon/FiltersBar';
import { SYMBOL_FILTER_ENUM } from '../../FuturesOrders/config';
import HistoryOrderTab from '../components/HistoryOrderTabs';
import { HistoryTopBarWrap } from '../style';

const FiltersBarArea = (props) => {
  const {
    handleFilterShow,
    screen,
    activeHideOther,
    namespace,
    tabs,
    activeTabKey,
    handleTabClick,
    tradeType,
  } = props;

  const etfCoin = useEtfCoin();
  // 现货 &&非杠杠代币 && 命中试验 展示TWAP历史订单tab切换栏
  const isShowTwapNodeTab =
    tradeType === SPOT && !etfCoin;

  const filterBarProps = {
    handleFilterShow,
    namespace,
    active: activeHideOther,
    screen,
    'data-inspector': 'trade-orderHistory-header',
    futuresType: SYMBOL_FILTER_ENUM.FUTURES_ORDER_HISTORY,
  };

  if (isShowTwapNodeTab) {
    return (
      <HistoryTopBarWrap>
        <MultiTypeOrderHistoryFilterBar
          {...filterBarProps}
          tabContentNode={
            <HistoryOrderTab
              tabs={tabs}
              activeIndex={activeTabKey}
              handleTabClick={handleTabClick}
            />
          }
        />
      </HistoryTopBarWrap>
    );
  }

  return <FiltersBar {...filterBarProps} futuresType={SYMBOL_FILTER_ENUM.FUTURES_ORDER_HISTORY} />;
};

export default memo(FiltersBarArea);
