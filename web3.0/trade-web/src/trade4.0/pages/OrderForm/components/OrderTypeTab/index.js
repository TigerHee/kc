/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-20 16:11:57
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-16 20:52:44
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/OrderTypeTab/index.js
 * @Description:
 */
/*
  * owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { map } from 'lodash';
import { Tabs } from '@mui/Tabs';
import { useYScreen } from '@/pages/OrderForm/config';
import useOrderTypeTabs from './useOrderTypeTabs';
import TabSelect from '../common/TabSelect';
import AdvancedLimitGuide from './AdvancedLimitGuide';

const { Tab } = Tabs;

const OrderTypeTab = React.memo(() => {
  const {
    tabs,
    onChange,
    activeTab,
    foldAciveTab,
    realActiveTab,
  } = useOrderTypeTabs();
  const yScreen = useYScreen();

  const onClick = useCallback((e) => {
    e.stopPropagation();
    onChange(e, foldAciveTab);
  }, [onChange, foldAciveTab]);

  return (
    <Tabs
      variant="line"
      value={activeTab}
      onChange={onChange}
      showIndicator={false}
      size={yScreen === 'sm' ? 'xxsmall' : 'xsmall'}
      data-inspector="trade-orderForm-orderTypeTabs"
    >
      <AdvancedLimitGuide />
      {
        map(tabs, (item) => {
          const { value, label, children } = item;
          return (
            <Tab
              key={value}
              value={value}
              isSelect={Boolean(children)}
              data-inspector={`trade-orderForm-orderType-${value}`}
              label={
                children ? (
                  <TabSelect
                    onClick={onClick}
                    options={children}
                    value={foldAciveTab}
                    realValue={realActiveTab}
                    onChange={v => onChange(undefined, v)}
                  />
                ) : (
                  label()
                )
              }
            />
          );
        })
      }
    </Tabs>
  );
});

export default OrderTypeTab;
