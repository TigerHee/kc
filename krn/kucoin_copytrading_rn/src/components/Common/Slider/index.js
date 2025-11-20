import Decimal from 'decimal.js';
import React, {memo, useCallback, useMemo} from 'react';
import {View} from 'react-native';
import styled, {css} from '@emotion/native';
import {Slider as KrnSlider, useTheme} from '@krn/ui';

import {commonStyles} from 'constants/styles';
import {divide, formatNumberShow} from 'utils/helper';
import {minus} from 'utils/operation';
import {LeverageSliderThumbIcon, SliderThumbIcon} from '../SvgIcon';

const SlideTopLabelWrap = styled.View`
  position: absolute;
  top: -20px;
  width: 60px;
  z-index: 999;
  left: ${({isLeftThumbAndNotInStart, isRightThumbAndInEnd}) =>
    isLeftThumbAndNotInStart || isRightThumbAndInEnd ? '-20px' : 0};
`;

export const SlideTopLabel = styled.Text`
  ${commonStyles.textSecondaryStyle}
  font-size: 12px;
  line-height: 15.6px;
  font-weight: 400;
  text-align: ${({isLeftThumbAndNotInStart, isRightThumbAndInEnd}) =>
    isLeftThumbAndNotInStart || !isRightThumbAndInEnd ? 'left' : 'center'};
`;

const Slider = props => {
  const {colorV2} = useTheme();
  const {
    maximumValue,
    hiddenThumbTopLabel = false,
    minimumValue,
    value,
    step,
    stepGap = 20,
    allowUpperLimit,
    showLeverageThumb = false,
  } = props;

  const defaultStep = useMemo(() => {
    if (step) return Number(step);
    return Number(
      divide(minus(maximumValue)(minimumValue), stepGap, Decimal.ROUND_DOWN),
    );
  }, [maximumValue, minimumValue, step, stepGap]);

  const renderThumbComponent = useCallback(
    thumbIndex => {
      const ThumbComp = !showLeverageThumb
        ? SliderThumbIcon
        : LeverageSliderThumbIcon;
      const [isLeftThumb, isRightThumb] = [thumbIndex === 0, thumbIndex === 1];
      const text = isLeftThumb
        ? value?.[0] || minimumValue
        : value?.[1] || maximumValue;

      const isLeftThumbAndNotInStart = isLeftThumb && text !== minimumValue;
      const isRightThumbAndInEnd = isRightThumb && text === maximumValue;

      const upperLimitChar =
        text === maximumValue && allowUpperLimit ? '+' : '';

      const showText = `${formatNumberShow(text, 0)}${upperLimitChar}`;
      if (hiddenThumbTopLabel) {
        return <ThumbComp />;
      }

      return (
        <View
          style={css`
            position: relative;
            width: 12px;
            height: 12px;
          `}>
          <SlideTopLabelWrap
            isLeftThumbAndNotInStart={isLeftThumbAndNotInStart}
            isRightThumbAndInEnd={isRightThumbAndInEnd}>
            <SlideTopLabel
              isLeftThumbAndNotInStart={isLeftThumbAndNotInStart}
              isRightThumbAndInEnd={isRightThumbAndInEnd}>
              {showText}
            </SlideTopLabel>
          </SlideTopLabelWrap>
          <ThumbComp />
        </View>
      );
    },
    [
      allowUpperLimit,
      hiddenThumbTopLabel,
      maximumValue,
      minimumValue,
      showLeverageThumb,
      value,
    ],
  );
  return (
    <KrnSlider
      renderThumbComponent={renderThumbComponent}
      trackStyle={css`
        height: 3px;
        background-color: ${colorV2.cover4};
      `}
      {...props}
      step={defaultStep}
    />
  );
};

export default memo(Slider);
