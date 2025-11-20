/**
 * Owner: mike@kupotech.com
 * 调整杠杆的弹框
 */

import React, { useState, useCallback, useMemo } from 'react';
import { _t } from 'utils/lang';
import InputNumber from '@mui/InputNumber';
import Slider from '@mui/RadioSlider';
import { Flex, Text } from 'Bot/components/Widgets';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';
import SymbolName from 'Bot/components/Common/SymbolName';
import { MIcons } from './Icon';
import { isRTLLanguage } from 'utils/langTools';
import styled from '@emotion/styled';

const MInputNumber = styled(InputNumber)`
  margin: 0 auto;
  width: 70%;
  fieldset {
    border: none !important;
  }
  input,
  .KuxInputNumber-unit {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 36px;
    font-weight: 600;
    line-height: 47px;
    height: 47px;
  }
  > div {
    // 加号
    &:nth-of-type(2),
    &:last-of-type {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.colors.cover4};
      &:hover {
        background-color: ${({ theme }) => theme.colors.cover8};
      }
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .KuxInputNumber-unit {
    position: absolute;
    top: 0;
    /* @noflip */
    right: 50px;
  }
`;
const getStep = (minLeverage, maxLeverage) => {
  if (maxLeverage <= 10) {
    return 1;
  }
  if (maxLeverage <= 15) {
    const diff = Number(maxLeverage - minLeverage);
    return [2, 3, 4, 5].find((stp) => diff % stp === 0) ?? 2;
  }
  return Math.floor((2 / 10) * maxLeverage);
};
const createMarks = (minLeverage, maxLeverage) => {
  minLeverage = Number(minLeverage);
  maxLeverage = Number(maxLeverage);
  const starter = minLeverage;
  let step = getStep(minLeverage, maxLeverage);
  const alwaysShowLimit = 5;
  let stepNum = Math.floor(maxLeverage / step);

  if (maxLeverage <= alwaysShowLimit) {
    stepNum = maxLeverage - minLeverage;
    step = 1;
  }
  const marks = {};
  Array.from({ length: stepNum }).forEach((_, index) => {
    const key = step * index + starter;
    const value = `${step * index + starter}x`;
    marks[key] = value;
  });
  marks[maxLeverage] = `${maxLeverage}x`;

  return marks;
};

const LeveragePicker = ({ leverageRef, step = 1, min = 2, max, value, onChange, symbolCode }) => {
  min = Number(min);
  max = Number(max);
  const [innerValue, setInnerValue] = useState(Number(value ?? min));

  const handleInnerValueChange = useCallback((v) => {
    setInnerValue(Number(v));
  }, []);
  const marks = useMemo(() => createMarks(min, max), [min, max]);
  const onconfirm = React.useCallback(() => {
    onChange(innerValue);
    leverageRef.current.close();
  }, [innerValue]);
  useBindDialogButton(leverageRef, onconfirm);
  return (
    <div className="mb-20">
      <Text as="div" fs={16} color="text40" lh="130%" mb={40}>
        <SymbolName value={symbolCode} />
      </Text>
      <Flex>
        <MInputNumber
          value={innerValue}
          onChange={handleInnerValueChange}
          autoComplete="off"
          step={step}
          maxPrecision={0}
          autoFixPrecision
          controlExpand
          unit="x"
          max={max}
          min={min}
        />
      </Flex>
      {+max > +min && (
        <Slider
          marks={marks}
          min={min}
          max={max}
          step={step}
          value={innerValue}
          onChange={handleInnerValueChange}
          reverse={isRTLLanguage()}
        />
      )}
    </div>
  );
};
const DialogWrap = ({ onVisibleChange, leverageRef, ...rest }) => {
  return (
    <DialogRef
      ref={leverageRef}
      title={_t('leverage.setting')}
      cancelText={_t('cancel')}
      okText={_t('confirmed')}
      onOk={() => leverageRef.current.confirm()}
      onVisibleChange={onVisibleChange}
      onCancel={() => leverageRef.current.close()}
      size="medium"
    >
      <LeveragePicker leverageRef={leverageRef} {...rest} />
    </DialogRef>
  );
};

const LeveragePickerWrap = React.memo(DialogWrap);

const LeverageText = React.memo((props) => {
  const leverageRef = React.useRef();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Flex vc cursor onClick={() => leverageRef.current.show()}>
        <Text fs={12} color="text40">
          {_t('tradeType.margin')}
        </Text>
        <Text fw={500} fs={12} color="text" ml={8} mr={4}>
          {props.value}x
        </Text>
        {open ? (
          <MIcons.TriangleUp size={12} color="icon" />
        ) : (
          <MIcons.TriangleDown size={12} color="icon" />
        )}
      </Flex>
      <LeveragePickerWrap onVisibleChange={setOpen} leverageRef={leverageRef} {...props} />
    </>
  );
});

export default LeverageText;
