import {useMemoizedFn} from 'ahooks';
import React, {memo, useMemo, useState} from 'react';
import {View} from 'react-native';

import Slider from 'components/Common/Slider';
import {ConditionText} from '../styles';

const BothSlider = props => {
  const {
    label,
    maximumValue,
    allowUpperLimit,
    minimumValue,
    formKey,
    value: propValue,
    stepGap,
  } = props;

  const [innerVal, setInnerVal] = useState([minimumValue, maximumValue]);

  const OnInnerChange = useMemoizedFn(val => {
    const [left, right] = val || [];

    setInnerVal(val);

    if (left === minimumValue && right === maximumValue) {
      props?.updateFormState({[formKey]: undefined});
      return;
    }

    props?.updateFormState({[formKey]: val});
  });

  const value = useMemo(() => propValue || innerVal, [innerVal, propValue]);

  return (
    <View key={formKey}>
      <ConditionText>{label}</ConditionText>

      <Slider
        maximumValue={maximumValue}
        minimumValue={minimumValue}
        value={value}
        onValueChange={OnInnerChange}
        trackClickable={false}
        thumbTouchSize={{width: 30, height: 40}}
        stepGap={stepGap}
        allowUpperLimit={allowUpperLimit}
      />
    </View>
  );
};

export default memo(BothSlider);
