/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-21 10:23:51
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-10 19:51:51
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeTypeTab/index.js
 * @Description:
 */
/*
 * owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { map } from 'lodash';
import { Tabs } from '@mui/Tabs';
import { isFuturesNew } from '@/meta/const';
// import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import useTradeTypeTabs from './useTradeTypeTabs';
import TabSelect from '../common/TabSelect';
import FuturesTab from './FuturesTab';
import FuturesGuide from './FuturesGuide';
import LabelWithLeverage from '../common/LabelWithLeverage';
// import GridTabWithRedDot from './GridTabWithRedDot';
import { TabsWrapper } from './style';

const { Tab } = Tabs;

const TradeTypeTab = React.memo(({ isFloat }) => {
  const { tabs, onChange, activeTab, foldAciveTab, realActiveTab } = useTradeTypeTabs();

  const onClick = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(e, foldAciveTab);
    },
    [foldAciveTab, onChange],
  );

  return (
    <TabsWrapper isFloat={isFloat} data-inspector="trade-orderForm-tradeTypeTabs">
      <Tabs size="xsmall" variant="line" value={activeTab} onChange={onChange}>
        {map(tabs, (item) => {
          const { value, label, children } = item;
          return (
            <Tab
              key={value}
              value={value}
              isSelect={Boolean(children)}
              label={
                children ? (
                  <TabSelect
                    onClick={onClick}
                    options={children}
                    value={foldAciveTab}
                    realValue={realActiveTab}
                    onChange={(v) => onChange(undefined, v)}
                    renderLabel={(v) => (
                      <LabelWithLeverage tradeType={foldAciveTab}>{v}</LabelWithLeverage>
                    )}
                  />
                ) : (
                  <LabelWithLeverage tradeType={value}>{label}</LabelWithLeverage>
                )
              }
            />
          );
        })}
        {/* <Tab key="BotTab" value="BotTab" label={<GridTabWithRedDot />} />; */}
        {/* {isFuturesNew() ? null : <Tab key="FuturesTab"
        value="FuturesTab" label={<FuturesTab />} />} */}
      </Tabs>
      {Boolean(isFuturesNew()) && <FuturesGuide />}
    </TabsWrapper>
  );
});

export default TradeTypeTab;
