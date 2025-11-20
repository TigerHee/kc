/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState } from 'react';
import { div100, formatNumber } from 'Bot/helper';
import { Switch } from '@kux/mui';
import DialogRef from 'Bot/components/Common/DialogRef';
import { getCurrencyName, getCurrencyInfo } from 'Bot/hooks/useSpotSymbolInfo';
import { getOtherCoinsRatio } from 'SmartTrade/services';
import useDeepCompareEffect from 'Bot/hooks/useDeepCompareEffect';
import debounce from 'lodash/debounce';
import useGetBalance from './useGetBalance';
import Popover from 'Bot/components/Common/Popover';
import { _t, _tHTML } from 'Bot/utils/lang';
import { InvestmentTemp } from 'Bot/components/Common/Investment/index.js';
import { FormItem } from 'Bot/components/Common/CForm';
import { Flex, Text } from 'Bot/components/Widgets';
import styled from '@emotion/styled';

/**
 * @description: 检查是否完全100%配平
 * @param {*} items
 * @return {*}
 */
const isFull = (items) => {
  return (
    items.reduce((p, n) => {
      return p + Number(n.value || 0);
    }, 0) === 100
  );
};
const showBalanceList = ({ sumInUsdt, currentAccountList }) => {
  const content = (
    <>
      <Flex sb fs={14} lh="22px" mb={8} pb={8}>
        <Text color="text40">{_t('smart.available')} </Text>
        <Text color="text">{formatNumber(sumInUsdt)}</Text>
      </Flex>
      {currentAccountList.map((coin) => {
        const { currencyName, precision } = getCurrencyInfo(coin.currency);
        return (
          <Flex sb fs={12} mb={8} key={coin.currency}>
            <Text color="text60">{currencyName}</Text>
            <Text color="text">{formatNumber(coin.availableBalance, precision)}</Text>
          </Flex>
        );
      })}
    </>
  );
  DialogRef.info({
    title: _t('futrgrid.bbaccount'),
    content,
    okText: _t('confirm'),
    cancelText: null,
    maskClosable: true,
  });
};

const DashText = styled.span`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 12px;
  text-decoration: underline dashed ${({ theme }) => theme.colors.text20};
  text-underline-offset: 2px;
  margin-right: 4px;
  cursor: pointer;
`;
const Box = styled.div`
  .balance-value {
    cursor: pointer;
    text-decoration: underline dashed ${({ theme }) => theme.colors.text20};
    text-underline-offset: 2px;
  }
`;
/**
 * @description: 持仓投资额模块
 * @return {*}
 */
export default ({ formData, form, symbolInfo, inverstLabel }) => {
  const { useOtherCoins, limitAsset } = form.getFieldsValue(['useOtherCoins', 'limitAsset']);
  const { quotaPrecision, quota } = symbolInfo;
  const { coins, minInverstment } = formData;
  // 获取用户资产
  const availBalance = useGetBalance({
    useOtherCoins,
    coins,
  });
  const { sumInUsdt } = availBalance;
  // 最大投资限制
  const maxAvail = Math.floor(sumInUsdt);
  const balance = {
    baseAmount: maxAvail,
    quoteAmount: maxAvail,
    totalAmount: maxAvail,
  };
  const isShowConsume = useOtherCoins && limitAsset && isFull(coins);
  const onBalanceClick = useCallback(() => {
    showBalanceList(availBalance);
  }, [availBalance]);
  return (
    <Box>
      <InvestmentTemp
        label={inverstLabel}
        rightSlot={
          <Flex vc>
            <Popover
              placement="top-end"
              title={_t('smart.coinsecondsure')}
              content={_tHTML('smart.coinsecondsurecont')}
            >
              <DashText className="right">{_t('smart.usecoins')}</DashText>
            </Popover>
            <FormItem name="useOtherCoins" noStyle>
              <Switch />
            </FormItem>
          </Flex>
        }
        hasMultiCoin={false}
        minInvest={minInverstment}
        maxInvestment={maxAvail}
        quota={quota}
        maxPrecision={quotaPrecision}
        balance={balance}
        onBalanceClick={onBalanceClick}
      />
      {isShowConsume && (
        <CurrentHasInvestment symbolInfo={symbolInfo} limitAsset={limitAsset} coins={coins} />
      )}
    </Box>
  );
};

//
/**
 * @description: 获取币种的具体使用了多少
 * @param {*} coins 币种信息
 * @param {*} limitAsset 当前投资额度
 * @param {*} useOtherCoins 是否使用多币种
 * @return {*}
 */
export const fetchOtherCoinsRatio = (coins, limitAsset, useOtherCoins) => {
  if (!coins.length || !limitAsset) return Promise.reject();
  const submitData = {
    targets: coins.map((coin) => ({
      currency: coin.currency,
      percent: div100(coin.value),
    })),
    totalValue: limitAsset,
    useMultipleInvestment: useOtherCoins,
  };
  // 过滤出符合条件的
  return getOtherCoinsRatio(submitData).then(({ data }) =>
    data.filter((el) => +el.balance > 0 && el.isAvailable),
  );
};
/**
 * @description: 固定引用截流
 * @param {*} debounce
 * @param {*} limitAsset
 * @param {*} setCoinsRatio
 * @return {*}
 */
const fetchListData = debounce(({ coins, limitAsset, setCoinsRatio }) => {
  fetchOtherCoinsRatio(coins, limitAsset, true).then(setCoinsRatio);
}, 1000);
/**
 * @description: 使用多币种， 并且投资额， 表单没错， 展示各币种的消耗情况
 * @return {*}
 */
const CurrentHasInvestment = ({ coins, limitAsset, symbolInfo: { quota } }) => {
  const [coinsRatio, setCoinsRatio] = useState([]);

  const onShowHandler = () => {
    // 打开触发一次
    fetchOtherCoinsRatio(coins, limitAsset, true).then(setCoinsRatio);
    const content = (
      <>
        <Flex vc sb fs={14} className="lh-22 mb-8 pb-8" color="text">
          <span>
            {_t('smart.gongtouru')}({quota})
          </span>
          <span>{formatNumber(limitAsset)}</span>
        </Flex>
        {coinsRatio.map((coin) => {
          return (
            <Flex sb fs={12} mb={8} key={coin.currency}>
              <Text color="text40">{getCurrencyName(coin.currency)}</Text>
              <Text color="text">{formatNumber(coin.balance)}</Text>
            </Flex>
          );
        })}
      </>
    );
    DialogRef.info({
      title: _t('smart.currentinversttext'),
      content,
      okText: _t('confirm'),
      cancelText: null,
      maskClosable: true,
    });
  };
  // 激活触发一次
  useDeepCompareEffect(() => {
    fetchListData({ coins, limitAsset, setCoinsRatio });
  }, [limitAsset, coins]);

  return (
    <Flex vc sb fs={12} mt={10}>
      <Text color="text40">{_t('smart.currentinversttext')}</Text>
      <Text color="text" className="balance-value right" onClick={onShowHandler}>
        {`${formatNumber(limitAsset) } ${quota}`} ( {_t('smart.numcoins', { num: coinsRatio.length })} )
      </Text>
    </Flex>
  );
};
