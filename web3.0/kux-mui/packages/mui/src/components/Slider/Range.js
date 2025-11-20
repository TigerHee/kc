/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import useTheme from 'hooks/useTheme';
import styled from 'emotion/index';
import Slider from 'rc-slider';
import { variant } from 'styled-system';
import PropTypes from 'prop-types';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const RangeWrapper = styled(Range)`
  ${variant({
    prop: 'size',
    variants: {
      small: {
        '&.KuxSlider': {
          height: 16,
          '.KuxSlider-rail, .KuxSlider-track, .KuxSlider-step': {
            height: 2,
          },
          '.KuxSlider-handle': {
            width: 12,
            height: 12,
            top: 5,
            borderWidth: 2,
          },
          '.KuxSlider-step': {
            '.KuxSlider-dot': {
              width: 10,
              height: 10,
              bottom: -4,
            },
          },
        },
      },
    },
  })}
`;

const CusRange = (props) => {
  const theme = useTheme();
  return (
    <RangeWrapper
      {...props}
      theme={theme}
      prefixCls="KuxSlider"
      tipProps={{ prefixCls: 'KuxSlider-tooltip' }}
    />
  );
};

CusRange.displayName = 'Range';

CusRange.propTypes = {
  size: PropTypes.oneOf(['default', 'small']),
  tipFormatter: PropTypes.func, // value => eg: `${value}%`
  min: PropTypes.number,
  max: PropTypes.number,
  marks: PropTypes.oneOfType([PropTypes.node, PropTypes.object]), // { number: ReactNode } or {number: { style, label }}
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  defaultValue: PropTypes.arrayOf(PropTypes.number),
  value: PropTypes.arrayOf(PropTypes.number),
};

export default CusRange;

// 参考 rc-slider 9.x API
