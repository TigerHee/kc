/**
 * Owner: garuda@kupotech.com
 * Size Form props
 */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';

import Form from '@mui/Form';

import {
  QUANTITY_UNIT,
  CURRENCY_UNIT,
  _t,
  dividedBy,
  greaterThan,
  lessThan,
  multiply,
  thousandPointed,
  quantityPlaceholder,
  formatNumber,
} from '../../builtinCommon';
import { PrettyCurrency } from '../../builtinComponents';

import { USDS_MIN_VALUE } from '../../config';
import {
  getPositionSize,
  useGetIsLogin,
  useGetSymbolInfo,
  useGetUnit,
} from '../../hooks/useGetData';
import useGetUSDsUnit, { getConvertSize, getConvertValue } from '../../hooks/useGetUSDsUnit';
import { getPlaceholder, makeUnitValue, makeSizeForRatio } from '../../utils';

const countIntegers = (value) => {
  return Math.floor(value).toString().length;
};

const { useFormInstance } = Form;
const useSizeFieldProps = ({ name, price, closeOnly, simpleCheck }) => {
  const form = useFormInstance();

  const isLogin = useGetIsLogin();
  const { symbolInfo: contract } = useGetSymbolInfo();
  const { unit: _usdsUnit, chooseUSDsUnit, tradingUnit } = useGetUSDsUnit();
  const { unit: _unit } = useGetUnit();

  const rateRef = useRef(null);
  const hasResetCloseOnly = useRef(null);

  const formUnit = useMemo(() => {
    return simpleCheck ? _unit : _usdsUnit;
  }, [_unit, _usdsUnit, simpleCheck]);

  // 监控到 closeOnly 之后，设置对应的 Size 值
  useEffect(() => {
    // 简单校验不需要验证 closeOnly
    if (simpleCheck) return;
    if (closeOnly) {
      // 监听了price的变化，如果是市价单，price会一直变化，会导致用户输入的值一直被重置
      // 所以用hasResetCloseOnly.current记录一下是否已经被重置过了，被重置过了，就不执行后面的
      if (hasResetCloseOnly.current) {
        return;
      }
      hasResetCloseOnly.current = true;
      const inputSize = form.getFieldValue(name) || 0;
      const absPositionSize = Math.abs(getPositionSize());
      const positionSize = makeUnitValue({
        size: absPositionSize,
        multiplier: contract?.multiplier,
        tradingUnit,
      });
      let handleInputSize = inputSize;
      if (chooseUSDsUnit && !contract.isInverse) {
        handleInputSize = getConvertSize({
          size: inputSize,
          price,
          multiplier: contract.multiplier,
          tradingUnit,
          chooseUSDsUnit,
          isInverse: contract.isInverse,
        });
      }
      // 如果输入的 size > positionSize 则更新为仓位对应的数量
      if (greaterThan(handleInputSize)(positionSize)) {
        const size =
          makeSizeForRatio({
            positionSize: absPositionSize,
            ratio: 1,
            tradingUnit,
            multiplier: contract?.multiplier,
          }) || 0;
        let handleSize = size;
        if (chooseUSDsUnit && !contract.isInverse) {
          handleSize = getConvertValue({
            size,
            price,
            multiplier: contract.multiplier,
            tradingUnit,
            chooseUSDsUnit,
          });
        }
        form.setFieldsValue({ [name]: `${handleSize}` });
      }
    }
    if (!closeOnly) {
      hasResetCloseOnly.current = false;
    }
    // 屏蔽 form 的变动， setFieldsValue 无需监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeOnly, tradingUnit, contract.multiplier, chooseUSDsUnit, price, contract.isInverse]);

  const max = useMemo(() => {
    if (contract.isInverse) {
      return contract.maxOrderQty;
    }
    return tradingUnit === QUANTITY_UNIT
      ? contract.maxOrderQty
      : multiply(contract.maxOrderQty)(contract.multiplier).toNumber();
  }, [contract.maxOrderQty, contract.multiplier, tradingUnit, contract.isInverse]);

  const min = useMemo(() => {
    if (contract.isInverse) {
      return 1;
    }
    return tradingUnit === QUANTITY_UNIT ? 1 : contract.multiplier;
  }, [tradingUnit, contract.multiplier, contract.isInverse]);

  const validator = (__, value) => {
    if (!value || value === 0 || value === '0') {
      return Promise.reject(_t('input.amount.error'));
    }
    if (
      (lessThan(value)(min) || greaterThan(value)(max)) &&
      (!chooseUSDsUnit || contract.isInverse || simpleCheck)
    ) {
      return Promise.reject(
        _t('forward.contract.amount.check', {
          min: String(min),
          amount: formatNumber(max, { pointed: true, dropZ: true, positive: true }),
        }),
      );
    }
    // 如果是正向合约，并且数量为 currency，校验是否满足乘数规则
    if (
      !contract.isInverse &&
      tradingUnit === CURRENCY_UNIT &&
      contract.multiplier > 1 &&
      !chooseUSDsUnit
    ) {
      if (value % contract.multiplier !== 0) {
        return Promise.reject(
          _t('order.multiplier', {
            multiplier: thousandPointed(contract.multiplier),
          }),
        );
      }
    }
    if (chooseUSDsUnit && price && !contract.isInverse && !simpleCheck) {
      // 在选择usds作为单位的时候，最小值是0.01U, 判断最大的张数是否超过max
      // 根据后端配置的maxOrderQty, 用来判断是否超过最大值的u
      // 公式 最大输入值 = 最大张数 * 合约乘数 * 价格。
      const maxValue = multiply(multiply(contract.maxOrderQty)(contract.multiplier))(price);
      const minValue = multiply(multiply(1)(contract.multiplier))(price);
      if (lessThan(value)(minValue)) {
        return Promise.reject(
          _t('futures.amount.must.larger', {
            amount: formatNumber(minValue, { pointed: true, positive: true }),
            currency: contract.settleCurrency,
          }),
        );
      }
      if (greaterThan(value)(maxValue)) {
        return Promise.reject(
          _t('forward.contract.usds.amount.max.check', {
            amount: formatNumber(maxValue, { pointed: true, positive: true }),
            unit: contract.settleCurrency,
          }),
        );
      }
    }
    return Promise.resolve();
  };

  const step = useMemo(() => {
    if (contract.isInverse) {
      return contract.lotSize;
    }
    if (chooseUSDsUnit && !simpleCheck) {
      return USDS_MIN_VALUE;
    }
    return tradingUnit === QUANTITY_UNIT ? contract.lotSize : contract.multiplier;
  }, [
    contract.isInverse,
    contract.lotSize,
    contract.multiplier,
    chooseUSDsUnit,
    simpleCheck,
    tradingUnit,
  ]);

  const addOrSubStep = useMemo(() => {
    if (!chooseUSDsUnit || contract.isInverse || simpleCheck) {
      return step;
    }
    if (!price || !contract.multiplier) {
      return step;
    }
    const singleContractValue = multiply(price)(contract.multiplier).toNumber();
    const len = countIntegers(singleContractValue);
    if (lessThan(singleContractValue)(1) || lessThan(len)(1)) {
      return step;
    }
    return multiply(len - 1)(10).toNumber();
  }, [chooseUSDsUnit, contract.isInverse, contract.multiplier, simpleCheck, price, step]);

  const helperText = useCallback(
    (value) => {
      const errors = form.getFieldError(name);
      if (errors && errors.length) {
        return errors[0];
      }
      if (isLogin && value) {
        if (!price || price === '-') return false;

        if (!chooseUSDsUnit || contract.isInverse || simpleCheck) {
          // 输入数量时计算对应的法币价格
          let currencyNum = 0;
          if (contract.isInverse) {
            currencyNum = dividedBy(value)(price);
          } else if (tradingUnit === CURRENCY_UNIT) {
            currencyNum = multiply(value)(price);
          } else {
            currencyNum = multiply(multiply(value)(contract.multiplier))(price);
          }

          return (
            <PrettyCurrency
              value={currencyNum}
              currency={contract.settleCurrency}
              isShort
              showUnitLabel
              notUnit
              mark="≈"
            />
          );
        }
        if (chooseUSDsUnit && !contract.isInverse && !simpleCheck) {
          const unitNumber = getConvertSize({
            size: value,
            price,
            multiplier: contract.multiplier,
            tradingUnit,
            chooseUSDsUnit,
            isInverse: contract.isInverse,
          });
          return <span>{`${thousandPointed(unitNumber)} ${_unit}`}</span>;
        }
      }
      if (
        !contract.isInverse &&
        tradingUnit === CURRENCY_UNIT &&
        greaterThan(contract.multiplier)(1)
      ) {
        return _t('order.multiplier', { multiplier: contract.multiplier });
      }
      return false;
    },
    // 屏蔽 form 的变动， getFieldError 无需监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      isLogin,
      contract.isInverse,
      contract.multiplier,
      contract.settleCurrency,
      tradingUnit,
      price,
      chooseUSDsUnit,
      _unit,
    ],
  );

  const triggerChange = useCallback((v) => {
    form.setFieldsValue({ [name]: v });
    // 屏蔽 form 的变动， setFieldsValue 无需监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 清空 rate
  const handleResetRate = useCallback(() => {
    if (rateRef && rateRef.current) {
      rateRef.current.reset();
    }
  }, []);

  // Size 输入框变动时，重置百分比选择
  const handleChange = useCallback(() => {
    handleResetRate();
  }, [handleResetRate]);

  useEffect(() => {
    if (tradingUnit) {
      form.setFields([{ name, value: '', errors: [] }]);
      handleResetRate();
    }
    // 屏蔽 form 的变动， setFields 无需监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradingUnit, chooseUSDsUnit, name, handleResetRate]);

  const placeholder = useMemo(() => {
    let text = quantityPlaceholder(contract, _t);
    if (!contract.isInverse) {
      text = tradingUnit === QUANTITY_UNIT ? text : getPlaceholder(step);
    }
    // 如果是按照usds下单，默认文案是0.00
    if (chooseUSDsUnit && !simpleCheck) {
      return '0.00';
    }
    return text;
  }, [contract, chooseUSDsUnit, simpleCheck, tradingUnit, step]);

  // 设置 rate 值
  const setRateValue = useCallback(
    (value) => {
      if (rateRef && rateRef.current) {
        rateRef.current.set(value);
      }
    },
    [rateRef],
  );

  return {
    triggerChange,
    setRateValue,
    isLogin,
    validator,
    unit: formUnit,
    step,
    placeholder,
    addOrSubStep,
    helperText,
    handleChange,
    rateRef,
    resetRateValue: handleResetRate,
  };
};

export default useSizeFieldProps;
