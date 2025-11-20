/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 20:55:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-02 17:42:10
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/OrderTabs.js
 * @Description:
 */
import React, { useEffect } from 'react';
import { map, add } from 'lodash';
import Radio from '@mui/Radio';
import { useSelector, useDispatch } from 'dva';
import { styled, fx } from '@/style/emotion';
import ScrollWrapper from '@/components/ScrollWrapper';
import { isFuturesNew, FUTURES } from '@/meta/const';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useOrderStopTableData } from '@/hooks/futures/useOrderStop';
import { useActiveOrderLen } from '@/hooks/futures/useActiveOrder';
import { generateOpenOrderTabCounterNum } from './presenter/utils';

const ScrollComp = styled(ScrollWrapper)`
  flex: 1;
  overflow-x: auto;
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  .KuxRadio-group {
    display: flex;
  }
  .KuxRadio-wrapper {
    font-size: 12px;
    font-weight: 500;
    height: 24px;
    padding: 4px 10px;
    background: none;

    .KuxRadio-text {
      color: ${(props) => props.theme.colors.text40};
    }
    &.KuxRadio-wrapper-checked {
      ${(props) => fx.backgroundColor(props, 'cover4')}

      .KuxRadio-text {
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
`;

const CommonOrderTabs = ({
  tabs,
  activeIndex,
  handleTabClick,
  currentTotalNum,
  stopTotalNum,
  twapOrderTotalNum,
}) => {
  return (
    <ScrollComp>
      <RadioWrapper>
        <Radio.Group value={activeIndex} size="large" onChange={(e, v) => handleTabClick(v)}>
          {map(tabs, (item) => {
            const totalNumber = generateOpenOrderTabCounterNum(item, {
              currentTotalNum,
              stopTotalNum,
              twapOrderTotalNum,
            });

            return (
              <Radio.Button
                value={item.key}
                key={item.key}
              >{`${item.label()} (${totalNumber})`}</Radio.Button>
            );
          })}
        </Radio.Group>
      </RadioWrapper>
    </ScrollComp>
  );
};

const OldOrderTabs = ({ tabs, activeIndex, handleTabClick }) => {
  const currentTotalNum = useSelector((state) => state.orderCurrent.totalNum);
  const stopTotalNum = useSelector((state) => state.orderStop.totalNum);
  const twapOrderTotalNum = useSelector((state) => state.orderTwap.totalNum);
  return (
    <CommonOrderTabs
      tabs={tabs}
      activeIndex={activeIndex}
      handleTabClick={handleTabClick}
      currentTotalNum={currentTotalNum}
      stopTotalNum={stopTotalNum}
      twapOrderTotalNum={twapOrderTotalNum}
    />
  );
};

const NewOrderTabs = ({ tabs, activeIndex, handleTabClick }) => {
  const dispatch = useDispatch();
  const currentTotalNum = useSelector((state) => state.orderCurrent.totalNum);
  const stopTotalNum = useSelector((state) => state.orderStop.totalNum);
  const twapOrderTotalNum = useSelector((state) => state.orderTwap.totalNum);

  const tradeType = useTradeType();
  const currentLength = useActiveOrderLen();
  const stopOrders = useOrderStopTableData();
  const stopLength = stopOrders.length;

  const currentShowTotalNum = tradeType === FUTURES ? currentLength : currentTotalNum;
  const stopShowTotalNum = tradeType === FUTURES ? stopLength : stopTotalNum;

  return (
    <CommonOrderTabs
      tabs={tabs}
      activeIndex={activeIndex}
      handleTabClick={handleTabClick}
      currentTotalNum={currentShowTotalNum}
      stopTotalNum={stopShowTotalNum}
      twapOrderTotalNum={twapOrderTotalNum}
    />
  );
};

const OrderTabs = ({ tabs, activeIndex, handleTabClick }) => {
  return isFuturesNew() ? (
    <NewOrderTabs tabs={tabs} activeIndex={activeIndex} handleTabClick={handleTabClick} />
  ) : (
    <OldOrderTabs tabs={tabs} activeIndex={activeIndex} handleTabClick={handleTabClick} />
  );
};

export default React.memo(OrderTabs);
