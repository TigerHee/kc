/**
 * Owner: garuda@kupotech.com
 * Size Form 控件
 */
import React, { useImperativeHandle } from 'react';

import SizeRate from './SizeRate';

import useSizeFieldProps from './useSizeFieldProps';

import { _t } from '../../builtinCommon';
import { FormNumberItem } from '../../builtinComponents';
import { useGetYSmall } from '../../hooks/useGetData';
import { FormItemLabel } from '../commonStyle';
import QtySwitch from '../QtySwitch';

const SizeField = ({ name, price, closeOnly, label, footer, simpleCheck = false }, parentRef) => {
  const {
    triggerChange,
    setRateValue,
    isLogin,
    validator,
    unit,
    step,
    placeholder,
    addOrSubStep,
    helperText,
    handleChange,
    rateRef,
    resetRateValue,
  } = useSizeFieldProps({ name, price, closeOnly, simpleCheck });

  // 对父级暴露set函数
  useImperativeHandle(parentRef, () => ({
    setValue: triggerChange,
    setRate: setRateValue,
    resetRate: resetRateValue,
  }));

  const isYScreenSM = useGetYSmall();

  return (
    <FormNumberItem
      name={name}
      label={
        label === false || isYScreenSM
          ? null
          : label || (
              // eslint-disable-next-line react/jsx-indent
              <FormItemLabel>
                <span className="label">{_t('assets.depositRecords.amount')}</span>
                <QtySwitch />
              </FormItemLabel>
            )
      }
      validator={isLogin ? validator : null}
      unit={isYScreenSM ? <QtySwitch showBrackets={false} /> : unit}
      step={step}
      placeholder={placeholder}
      inputProps={{
        addOrSubStep,
        helperText,
        onChange: handleChange,
        size: isYScreenSM ? 'small' : 'medium',
      }}
      footer={
        footer || (
          <SizeRate
            size={isYScreenSM ? 'small' : 'medium'}
            name={name}
            ref={rateRef}
            price={price}
            closeOnly={closeOnly}
          />
        )
      }
    />
  );
};

export default React.memo(React.forwardRef(SizeField));
