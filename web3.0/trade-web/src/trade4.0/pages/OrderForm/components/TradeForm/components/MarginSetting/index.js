/*
 * owner: borden@kupotech.com
 */
import React, { useEffect, useCallback, useState, useContext } from 'react';
import {
  ICMarginOutlined,
  ICRepayOutlined,
  ICBorrowOutlined,
  ICBorrowAndRepayOutlined,
} from '@kux/icons';
import { useDispatch } from 'dva';
import storage from 'src/utils/storage';
import { _t, _tHTML } from 'src/utils/lang';
import { Tabs } from '@mui/Tabs';
import Box from '@mui/Box';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { sensorFunc } from '@/hooks/useSensorFunc';
import useMarginOrderModeType from '@/hooks/useMarginOrderModeType';
import useSide from '@/pages/OrderForm/hooks/useSide';
import {
  useYScreen,
  BORROW_TYPE,
  WrapperContext,
  MARGIN_ORDER_MODE_ENUM,
} from '@/pages/OrderForm/config';
import Introduction from './Introduction';
import { LeftBox, Container, TabsPro } from './style';

const { Tab } = Tabs;

const {
  NORMAL,
  AUTO_REPAY,
  AUTO_BORROW,
  AUTO_BORROW_AND_REPAY,
} = MARGIN_ORDER_MODE_ENUM;

const ORDER_MODE_OPTIONS = [
  {
    value: NORMAL,
    label: _t('iVef1SeL2dmtBmSiEeSqpe'),
    Icon: props => <ICMarginOutlined {...props} />,
    describe: _t('4fHAR35sAKRtfTvV2zf65W'),
    sensorFunc: () => sensorFunc(['tradingArea', 'normalTab', 'click']),
  },
  {
    value: AUTO_BORROW,
    label: _t('orderForm.autoBorrow'),
    Icon: props => <ICBorrowOutlined {...props} />,
    describe: _t('1asM5t2qSPqRLWEgUskJYN'),
    sensorFunc: () => sensorFunc(['tradingArea', 'autoBorrowTab', 'click']),
  },
  {
    value: AUTO_REPAY,
    label: _t('n.trade.asset.autopayback'),
    Icon: props => <ICRepayOutlined {...props} />,
    describe: _t('vwT1FBMKDCHYCCaaP6B9NL'),
    sensorFunc: () => sensorFunc(['tradingArea', 'autoRepayTab', 'click']),
  },
  {
    value: AUTO_BORROW_AND_REPAY,
    label: _t('8ahpPQnYxwsCXySmifH569'),
    Icon: props => <ICBorrowAndRepayOutlined {...props} />,
    describe: _t('ukPau1gYKxhinz1vH5ScCD'),
    sensorFunc: () => sensorFunc(['tradingArea', 'autoBorrowAndRepayTab', 'click']),
  },
];

const MarginSetting = React.memo(({ isFloat }) => {
  const { side } = useSide();
  const yScreen = useYScreen();
  const dispatch = useDispatch();
  const screen = useContext(WrapperContext);
  const { currentMarginOrderModeKey } = useMarginOrderModeType();

  const [value, setValue] = useState(AUTO_BORROW);

  const isMd = screen === 'md';
  const isBuy = side === 'buy';
  const showInfo = !(isMd && isBuy);

  useEffect(() => {
    const initValue = storage.getItem(currentMarginOrderModeKey) || AUTO_BORROW;
    setValue(initValue);
  }, [currentMarginOrderModeKey]);

  // 这里要把用户之前的设置 自动借币 给置成 手动的，如果用户不清除缓存会都走到 自动借币的 接口
  useEffect(() => {
    const isolatedKey = TRADE_TYPES_CONFIG.MARGIN_TRADE.borrowTypeKey;
    const marginKey = TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.borrowTypeKey;
    const manual = BORROW_TYPE.manual;

    storage.setItem([marginKey], manual);
    storage.setItem([isolatedKey], manual);
    dispatch({
      type: 'tradeForm/update',
      payload: {
        [isolatedKey]: manual,
        [marginKey]: manual,
      },
    });
  }, [dispatch]);

  // 更新下单模式
  const handleTabChange = useCallback(
    (event, newValue) => {
      setValue(newValue);
      storage.setItem(currentMarginOrderModeKey, newValue);

      dispatch({
        type: 'tradeForm/update',
        payload: {
          [currentMarginOrderModeKey]: newValue,
        },
      });
      const option = ORDER_MODE_OPTIONS.find((v) => (v.value === newValue));
      if (option?.sensorFunc) option.sensorFunc();
    },
    [currentMarginOrderModeKey, dispatch],
  );

  return (
    <Container>
      <LeftBox>
        <Box>
          <TabsPro
            value={value}
            variant="bordered"
            activeType="primary"
            inLayer={!!isFloat}
            onChange={handleTabChange}
            size={yScreen === 'sm' ? 'xxsmall' : 'xsmall'}
          >
            {ORDER_MODE_OPTIONS.map(({ label, value: val }) => {
              return <Tab label={label} value={val} key={val} />;
            })}
          </TabsPro>
        </Box>
        {showInfo && (
          <Introduction title={_t('s1QaS6nFckBGAFzyuy5zUw')} data={ORDER_MODE_OPTIONS} />
        )}
      </LeftBox>
    </Container>
  );
});

export default MarginSetting;
