/**
 * Owner: mike@kupotech.com
 */
/* eslint-disable no-shadow */
import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import CloseBotRadio, {
  ReturnInCoin,
  ReturnInAllCoin,
} from './CloseBotRadio';
import {
  useBindDialogConfirm,
} from 'Bot/components/Common/DialogRef';
import _ from 'lodash';
import useStateRef from '@/hooks/common/useStateRef';
import { CloseCouponRow } from 'Bot/Strategies/components/Coupon';
import { getOpenOrders } from 'Bot/Strategies/SmartTrade/services';
import { usdtLimit, closeParams } from 'Bot/config';
import { Text } from 'Bot/components/Widgets';
import { useDispatch } from 'dva';
import { _t, _tHTML, t } from 'Bot/utils/lang';
import { FontSizeBox } from './style';

const CloseBot = ({ item, dialogRef }) => {
  const [returnValue, setReturnValue] = useState(undefined);
  useEffect(() => {
    getOpenOrders(item.id).then(({ data: { totalValue } }) => {
      setReturnValue(+totalValue);
    });
  }, [item.id]);
  // 处理持仓中恰好只有USDT,那么就不显示第二个选择
  // 处理价值大于10WUSDT的，就只能原路返回

  // 处理持仓中恰好只有USDT,那么就不显示第二个选择
  // 处理价值大于10WUSDT的，就只能原路返回
  const { defaultSelectValue, radiosSelection, text } = useMemo(() => {
    const radiosSelection = [];
    let text = {};
    // 默认选中第一个
    const defaultSelectValue = 1;

    const coinTexts = item.snapshots.map((el) => el.currency);
    const notShowUSDTSelector =
      (coinTexts.length === 1 && coinTexts[0] === 'USDT') ||
      returnValue > usdtLimit;

    radiosSelection.push(
      <div value={1} key="all">
        <ReturnInAllCoin coins={coinTexts} />
      </div>,
    );
    if (!notShowUSDTSelector) {
      radiosSelection.push(
        <div value={3} key="USDT">
          <ReturnInCoin coin="USDT" />
        </div>,
      );
    }
    text = {
      1: _tHTML('closedesc', { num: `${returnValue} USDT` }),
      3: _tHTML('closedesc3', { num: `${returnValue} USDT`, coin: 'USDT' }),
    };

    return {
      radiosSelection,
      defaultSelectValue,
      text,
    };
  }, [returnValue, item]);

  const [radioValue, setRadioValue] = useState(defaultSelectValue);
  const closeRef = useRef();
  const onRadioChangeHandlerJack = useCallback((e) => {
    setRadioValue(e);
    closeRef.current = closeParams[e];
  }, []);

  const useDataRef = useStateRef({
    item,
  });
  const dispatch = useDispatch();
  const onConfirm = useCallback(() => {
    const { item } = useDataRef.current;
    const { sellAllBase, buyBase } = closeRef.current;
    dialogRef.current.updateOkLoading(true);
    dispatch({
      type: 'BotRunning/toStopMachine',
      payload: {
        id: item.id,
        sellAllBase,
        buyBase,
      },
    })
      .then(() => {
        dialogRef.current.toggle();
      })
      .finally(() => {
        dialogRef.current.updateOkLoading(false);
      });
  }, []);
  useBindDialogConfirm(dialogRef, onConfirm);

  return (
    <FontSizeBox>
      <Text fs={18} as="div" className="sm-title" mb={16} color="text">
        {_t('areyousure', { bot: item.name })}
      </Text>
      <Text type="text60" as="div" mb={16} className="sm-desc">
        {text[radioValue]}
      </Text>
      <CloseBotRadio
        onChange={onRadioChangeHandlerJack}
        defaultValue={defaultSelectValue}
      >
        {radiosSelection}
      </CloseBotRadio>
      <CloseCouponRow taskId={item.id} />
    </FontSizeBox>
  );
};


export default CloseBot;
