/* eslint-disable prefer-const */
/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Decimal from 'decimal.js';
import NumberInput from '@/components/NumberInput';
import { css } from '@emotion/css';
import Unit from 'src/trade4.0/pages/OrderForm/components/TradeForm/components/Unit';
import styled from '@emotion/styled';

const inputMax = Math.pow(10, 10); // 限制直接输入的顶天的最大值
const EndBox = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  font-size: ${(props) => (props.size === 'small' ? '12px' : '14px')};
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    padding: ${(props) => (props.size === 'small' ? '0 4px 0' : '0 8px 0 4px')};
  }
`;
const elipse = css`
  input {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
const lessThanOrEqualTo = (a, b) => {
  return Decimal(a || 0).lessThanOrEqualTo(b || 0);
};
const lessThan = (a, b) => {
  return Decimal(a || 0).lessThan(b || 0);
};
const greaterThanOrEqualTo = (a, b) => {
  return Decimal(a || 0).greaterThanOrEqualTo(b || 0);
};
const greaterThan = (a, b) => {
  return Decimal(a || 0).greaterThan(b || 0);
};
export default React.forwardRef((props, ref) => {
  let {
    maxPrecision, // 最大精度
    filter, // 外部过滤函数
    min = 0, // 业务可以输入的最小值
    max, // 业务可以的最大值
    autoFixMinOnBlur = true,
    value,
    onChange,
    className,
    controls = true, // 加减控制
    disabled,
    step = 1,
    onMax,
    size = 'medium',
    unit,
    onBlur,
    ...rest
  } = props;
  const triggerChange = (_value, from) => {
    let val = _value;
    if (filter) {
      val = filter(val, from);
    }
    // 有变化才抛出
    if (value !== val) {
      onChange && onChange(val);
    }
  };
  const handleChange = (e) => {
    let val = e ?? '';
    val = String(val).trim();
    // 限制最开头只能最多输入一个0
    if (/^0{2,}/.test(val)) {
      return;
    }
    // 有值 限制只能输入数字
    // 有为''的情况
    if (val) {
      // 处理中文输入法，输入点不能输入的问题
      // 将中的句点。转成英文.
      val = val.replace('。', '.');
      // eslint-disable-next-line no-useless-escape
      if (!/^\-?\d+(\.\d*)?$/.test(val)) {
        return;
      }
    }
    // 直接限制最大输入精度
    const decimalFraction = val.split('.')[1] || '';
    // 为0限制为整数
    if (+maxPrecision === 0) {
      if (decimalFraction.length > 0) {
        return;
      }
    } else if (+maxPrecision > 0 && decimalFraction.length > +maxPrecision) {
      return;
    }
    // 直接限制最大输入值
    if (+val > +max) {
      val = +max;
    }
    // if (val !== '' && +val < +min) {
    //   return;
    // }
    // 直接限制最大输入值
    if (+val > inputMax) {
      return;
    }
    triggerChange(val, 'input');
  };
  const handleBlur = () => {
    onBlur && onBlur();
    // 失去焦点自动校正最小
    if (autoFixMinOnBlur && min !== undefined && value && Number(value) < Number(min)) {
      triggerChange(min, 'auto');
    }
  };
  // 加减按钮的反应函数
  const setNum = (dict) => {
    if (value === undefined || value === null) return;
    // 操作后的值
    const afterValueDecimal = Decimal(value || 0).add(Decimal(dict).times(step));
    // const afterValue = afterValueDecimal.toNumber();
    if (min !== undefined && dict < 0) {
      if (lessThanOrEqualTo(value, min) || lessThan(afterValueDecimal, min)) {
        return;
      }
      // if (Number(value) <= Number(min) || afterValue < Number(min)) {
      //   return;
      // }
    }

    if (max !== undefined && dict > 0) {
      // if (Number(value) >= Number(max) || afterValue > Number(max)) {
      //   onMax && onMax(max);
      //   return;
      // }
      if (greaterThanOrEqualTo(value, max) || greaterThan(afterValueDecimal, max)) {
        onMax && onMax(max);
        return;
      }
      // 如果增加的时候，当前值小于最小值，就直接增加到最小值
      // if (Number(value) < Number(min)) {
      //   return triggerChange(min, 'btn');
      // }
      if (min !== undefined && lessThan(value, min)) {
        return triggerChange(min, 'btn');
      }
    }

    // if (Number(value) > Number(max)) {
    //   return triggerChange(max, 'btn');
    // }
    if (max !== undefined && greaterThan(value, max)) {
      return triggerChange(max, 'btn');
    }

    let result;
    try {
      result = afterValueDecimal;
      if (!result.isNaN()) triggerChange(result.toFixed(), 'btn');
    } catch (e) {
      result = value;
    }
  };
  value = value ?? '';
  return (
    <NumberInput
      ref={ref}
      disabled={disabled}
      className={`${className} ${elipse}`}
      addOrSubStep={step}
      isAddOrSubTriggerChange={false}
      {...rest}
      places={maxPrecision}
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      onPlus={() => setNum(1)}
      onMinus={() => setNum(-1)}
      useTool={controls}
      unit={
        unit ? (
          <EndBox className="end-box">
            <Unit coinName={unit} />
          </EndBox>
        ) : null
      }
    />
  );
});
