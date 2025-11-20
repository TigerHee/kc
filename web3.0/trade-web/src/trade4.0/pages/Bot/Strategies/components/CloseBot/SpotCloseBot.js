/**
 * Owner: mike@kupotech.com
 */
/* eslint-disable no-shadow */
// 现货网格 无限网格 定投 马丁会用到， 适用于现货单个交易对
import React, { useCallback, useLayoutEffect, useState, useRef, useMemo } from 'react';
import CloseBotRadio, { ReturnInCoin, ReturnInAllCoin } from './CloseBotRadio';
import { useBindDialogConfirm } from 'Bot/components/Common/DialogRef';
import { getStoreAmount } from 'Bot/services/running';
import _ from 'lodash';
import { usdtLimit, closeParams } from 'Bot/config';
import useStateRef from '@/hooks/common/useStateRef';
import Decimal from 'decimal.js';
import { CloseCouponRow } from 'Bot/Strategies/components/Coupon';
import { Text, Flex } from 'Bot/components/Widgets';
import { useDispatch } from 'dva';
import { _t, _tHTML, t } from 'Bot/utils/lang';
import { formatNumber } from 'Bot/helper';
import { FontSizeBox, MSpin } from './style';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';

const getStoreAmountHandler = (taskId, symbolInfo) => {
  const {
    basePrecision,
    quotaPrecision,
    cbase,
    cquota,
    base: baseName,
    quota: quotaName,
  } = symbolInfo;
  return getStoreAmount(taskId).then(({ data }) => {
    data = data?.currencies || [];
    const results = {
      // baseKey: {
      //     val: '',
      //     code: '',
      //     name: '',
      //     showText: ''
      // },
      baseKey: undefined,
      quotaKey: undefined,
      totalVal: 0,
      coinNum: 0,
    };
    // 分离base，quota ,只显示大于0的
    for (let i = 0, len = data.length; i < len; i++) {
      const el = data[i];
      el.totalBalance = +el.totalBalance;
      // 截取精度前
      if (el.totalBalance > 0) {
        if (el.currency === cbase) {
          // 截取精度后
          el.totalBalance = Number(
            Decimal(el.totalBalance).toFixed(basePrecision, Decimal.ROUND_DOWN),
          );
          if (el.totalBalance > 0) {
            results.baseKey = {
              val: formatNumber(el.totalBalance),
              code: cbase,
              name: baseName,
            };
            // 展示的文本
            results.baseKey.showText = `${results.baseKey.val} ${baseName}`;

            results.coinNum += 1;
            // 计算相对USDT的总值
            results.totalVal += Number(el.baseCurrencyAmount || 0);
          }
        } else if (el.currency === cquota) {
          el.totalBalance = Number(
            Decimal(el.totalBalance).toFixed(quotaPrecision, Decimal.ROUND_DOWN),
          );
          if (el.totalBalance > 0) {
            results.quotaKey = {
              val: formatNumber(el.totalBalance),
              code: cquota,
              name: quotaName,
            };
            // 展示的文本
            results.quotaKey.showText = `${results.quotaKey.val} ${quotaName}`;
            results.coinNum += 1;
            results.totalVal += Number(el.baseCurrencyAmount || 0);
          }
        }
      }
    }
    return results;
  });
};

const CloseBot = ({ item, dialogRef }) => {
  const symbolInfo = useSpotSymbolInfo(item.symbol);
  const [returnValue, setReturnValue] = useState({});
  const {
    cbase: base,
    cquota: quota,
    base: baseName,
    quota: quotaName,
    symbolNameText,
  } = symbolInfo;
  const { id: taskId } = item;
  useLayoutEffect(() => {
    getStoreAmountHandler(taskId, symbolInfo).then(setReturnValue);
  }, []);

  // 处理持仓中恰好只有USDT,那么就不显示第二个选择
  // 处理价值大于10WUSDT的，就只能原路返回
  const { defaultSelectValue, radiosSelection, text } = useMemo(() => {
    const { baseKey, quotaKey, totalVal, coinNum } = returnValue;
    const radiosSelection = [];
    let text = {};
    // 默认选中第一个
    let defaultSelectValue = 1;
    // 没有币种，属于异常情况，直接显示quota
    if (coinNum === 0) {
      radiosSelection.push(
        <div value={3} key="quota">
          <ReturnInCoin coin={quota} />
        </div>,
      );
      defaultSelectValue = 3;
      text = {
        3: '',
      };
      return {
        radiosSelection,
        defaultSelectValue,
        text,
      };
    }
    // 无论一个还是两个币种，只要大于10wU，就只能原路退回
    if (usdtLimit < totalVal) {
      const coinTexts = [baseKey, quotaKey].filter((el) => !!el).map((el) => el.code);
      radiosSelection.push(
        <div value={1} key="all">
          <ReturnInAllCoin coins={coinTexts} />
        </div>,
      );
      // 判断是一个币种base/quota,还是两个币种
      text = {
        1:
          coinNum === 1
            ? _tHTML('closedesc', {
                num: baseKey ? baseKey.showText : quotaKey.showText,
              })
            : _tHTML('closedesc2', {
                num: baseKey.showText,
                num2: quotaKey.showText,
              }),
      };
      return {
        radiosSelection,
        defaultSelectValue,
        text,
      };
    }

    // 只有一个币种
    if (coinNum === 1) {
      // 只有base
      if (baseKey) {
        radiosSelection.push(
          <div value={1} key="all">
            <ReturnInAllCoin coins={[base]} />
          </div>,
          <div value={3} key="quota">
            <ReturnInCoin coin={quota} />
          </div>,
        );
        text = {
          1: _tHTML('closedesc', {
            num: baseKey.showText,
          }),
          3: _tHTML('closedesc3', {
            num: baseKey.showText,
            coin: quotaName,
          }),
        };
      } else if (quotaKey) {
        // 只有quota
        // 如果quota 是USDT,只能原路退回
        if (quota === 'USDT') {
          radiosSelection.push(
            <div value={1} key={quota}>
              <ReturnInAllCoin coins={[quota]} />
            </div>,
          );
        } else {
          radiosSelection.push(
            <div value={1} key="quota">
              <ReturnInAllCoin coins={[quota]} />
            </div>,
            <div value={2} key="base">
              <ReturnInCoin coin={base} />
            </div>,
          );
        }
        text = {
          1: _tHTML('closedesc', {
            num: quotaKey.showText,
          }),
          2: _tHTML('closedesc3', {
            num: quotaKey.showText,
            coin: baseName,
          }),
        };
      }
    } else if (coinNum === 2) {
      // 有两个币种
      // 多个币种且小于10万U, 有三种选择
      radiosSelection.push(
        <div value={1} key="all">
          <ReturnInAllCoin coins={[base, quota]} />
        </div>,
        <div value={3} key="quota">
          <ReturnInCoin coin={quota} />
        </div>,
        <div value={2} key="base">
          <ReturnInCoin coin={base} />
        </div>,
      );
      text = {
        1: _tHTML('closedesc2', {
          num: baseKey.showText,
          num2: quotaKey.showText,
        }),
        2: _tHTML('closedesc4', {
          num: baseKey.showText,
          num2: quotaKey.showText,
          coin: baseKey.name,
        }),
        3: _tHTML('closedesc4', {
          num: baseKey.showText,
          num2: quotaKey.showText,
          coin: quotaKey.name,
        }),
      };
    }
    return {
      radiosSelection,
      defaultSelectValue,
      text,
    };
  }, [returnValue]);

  const [radioValue, setRadioValue] = useState(defaultSelectValue);
  const closeRef = useRef();
  const onRadioChangeHandlerJack = useCallback((e) => {
    setRadioValue(e);
    closeRef.current = closeParams[e];
  }, []);
  const dispatch = useDispatch();

  const useDataRef = useStateRef({
    taskId,
  });
  const onConfirm = useCallback(() => {
    const { taskId } = useDataRef.current;
    const { sellAllBase, buyBase } = closeRef.current;
    dialogRef.current.updateOkLoading(true);
    dispatch({
      type: 'BotRunning/toStopMachine',
      payload: {
        id: taskId,
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

  if (_.isEmpty(returnValue)) {
    return (
      <div className="Flex vc hc fullWidth">
        <MSpin />
      </div>
    );
  }

  return (
    <Flex column="column" sb className="flex1">
      <FontSizeBox>
        <Text fs={18} as="div" className="sm-title" mb={16} color="text">
          {_t('areyousure', { bot: `${symbolNameText} ${item.name}` })}
        </Text>
        <Text type="text60" as="div" mb={16} className="sm-desc">
          {text[radioValue]}
        </Text>
        <CloseBotRadio onChange={onRadioChangeHandlerJack} defaultValue={defaultSelectValue}>
          {radiosSelection}
        </CloseBotRadio>
      </FontSizeBox>
      <CloseCouponRow taskId={item.id} />
    </Flex>
  );
};
export default CloseBot;
