/*
 * owner: mike@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import AccountBalance from './AccountBalance';
import { FormNumberInputItem, Form } from 'Bot/components/Common/CForm';
import PickerCoin from './PickerCoin';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import GridInvestment from './GridInvestment';
import { dropZero, isNull, isFutureSymbol, formatNumber } from 'Bot/helper';
import useBalance from 'Bot/hooks/useBalance';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import Decimal from 'decimal.js';
import { _t } from 'Bot/utils/lang';
import { getInputMaxInvestPrecision } from 'Bot/config';
import { Text, Flex } from 'Bot/components/Widgets';

/**
 * @description: 投资额输入框, 带有百分比的按钮, 基本校验
 * @param {number} minInvest 显示在placeholder的最小投资额度
 * @param {number?} maxInvestment 最大投资额度
 * @param {object} balance
 * @param {number} maxPrecision 投资额度精度, 合约现货不同
 * @param {quota} quota 显示在placeholder的最小投资额度
 * @param {boolean} hasMultiCoin 显示在placeholder的最小投资额度
 * @param {string} label 显示的名字
 * @param {node} rightSlot 名字的右边
 * @param {function} onBalanceClick 点击余额函数
 * @param {string} formKey 表单字段
 * @return {*}
 */
export const InvestmentTemp = ({
  minInvest,
  maxInvestment,
  balance,
  quota,
  hasMultiCoin,
  symbol,
  maxPrecision,
  inputProps = {},
  hasGridInvest = true,
  label,
  rightSlot,
  onBalanceClick,
  formKey = 'limitAsset',
}) => {
  label = label ?? _t('gridform29');
  const form = Form.useFormInstance();
  const { baseAmount, quoteAmount, totalAmount } = balance;
  // 账户余额变动，最小投资额变动，需要重新校验总投资额
  useEffect(() => {
    const limitAsset = form.getFieldValue(formKey);
    // 强制重新校验
    limitAsset !== undefined && form.validateFields([formKey], { triggerName: 'onChange' });
  }, [baseAmount, quoteAmount, totalAmount, minInvest]);

  const onGridChange = useCallback(
    (data) => {
      const inverst =
        data === 'min'
          ? minInvest
          : Decimal(totalAmount).times(data).toFixed(maxPrecision, Decimal.ROUND_DOWN);
      form.setFieldsValue({ limitAsset: dropZero(inverst) });
      form.validateFields([formKey]);
    },
    [minInvest, totalAmount, maxPrecision, form, formKey],
  );
  const validator = (rule, value, cb) => {
    // if (!value) {
    //   return cb(_t('auto.inputinverst'));
    // }
    if (!isNull(value)) {
      value = Number(value);
      // 输入小于最小投资额
      if (value < Number(minInvest)) {
        return cb(_t('gridform32', { min: minInvest, quota }));
      }

      if (value > Number(totalAmount)) {
        return cb(_t('gridform31'));
      }
      if (maxInvestment) {
        if (value > Number(maxInvestment)) {
          return cb(
            _t('futrgrid.maxinput', {
              max: `${formatNumber(maxInvestment)} ${quota}`,
            }),
          );
        }
      }
    }
    cb();
  };
  return (
    <>
      {(label || rightSlot) && (
        <Flex sb vc>
          <Text as="div" color="text" fs={14} fw={500} lh="130%">
            {label}
          </Text>
          {rightSlot}
        </Flex>
      )}

      <AccountBalance quoteAmount={totalAmount} onBalanceClick={onBalanceClick} />
      {hasMultiCoin && <PickerCoin symbol={symbol} />}
      <FormNumberInputItem
        className="mb-8"
        name={formKey}
        placeholder={_t('futrgrid.gridwidget2', {
          min: minInvest,
        })}
        rules={[
          {
            required: true,
            validator,
          },
        ]}
        maxPrecision={maxPrecision}
        {...inputProps}
        unit={quota}
      />
      {hasGridInvest && <GridInvestment onGridChange={onGridChange} />}
    </>
  );
};
/**
 * @description: 现货投资额输入框
 * @param {*} symbol
 * @param {*} inputProps
 * @param {*} hasMultiCoin
 * @return {*}
 */
const SpotInvestment = ({
  label,
  symbol,
  inputProps = {},
  hasMultiCoin = false,
  rightSlot,
  ...rest
}) => {
  const form = Form.useFormInstance();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { base, quota, quotaPrecision } = symbolInfo;
  const useBaseCurrency = form.getFieldValue('useBaseCurrency');
  const lastTradedPrice = useLastTradedPrice(symbol);
  const balance = useBalance(symbolInfo, lastTradedPrice, Boolean(useBaseCurrency));
  return (
    <InvestmentTemp
      label={label}
      balance={balance}
      quota={quota}
      maxPrecision={quotaPrecision}
      hasMultiCoin={hasMultiCoin}
      inputProps={inputProps}
      symbol={symbol}
      rightSlot={rightSlot}
      {...rest}
    />
  );
};
/**
 * @description: 合约投资额输入框
 * 合约没有多币种
 * @param {*} symbol
 * @param {*} inputProps
 * @return {*}
 */
const FutureInvestment = ({ symbol, inputProps = {}, rightSlot, ...rest }) => {
  const symbolInfo = useFutureSymbolInfo(symbol);
  const { quota, precision } = symbolInfo;
  const balance = useBalance(symbolInfo, 0, false);
  // 合约类型策略, 投资额度精度长度限制在8位以内
  const quotaPrecision = getInputMaxInvestPrecision(precision);
  return (
    <InvestmentTemp
      label={_t('futrgrid.enterinverst')}
      rightSlot={rightSlot}
      balance={balance}
      quota={quota}
      maxPrecision={quotaPrecision}
      hasMultiCoin={false}
      inputProps={inputProps}
      symbol={symbol}
      {...rest}
    />
  );
};
/**
 * @description: 现货/合约统一的投资额组件, 根据symbol类型渲染
 * @return {*}
 */
export default (props) => {
  return isFutureSymbol(props.symbol) ? (
    <FutureInvestment {...props} />
  ) : (
    <SpotInvestment {...props} />
  );
};
