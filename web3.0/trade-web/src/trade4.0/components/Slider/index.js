/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import RcSlider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styled from '@emotion/styled';
import Tooltip from '@mui/Tooltip';
import { useIsRTL } from '@/hooks/common/useLang';

const SliderWrapper = styled(RcSlider)`
  .rc-slider-rail {
    background-color: ${(props) => props.theme.colors.cover8};
    height: 6px;
  }

  .rc-slider-track {
    background-color: ${(props) => props.theme.colors.primary};
    height: 6px;
  }

  .rc-slider-step {
    height: 6px;
  }

  .rc-slider-dot {
    width: 16px;
    height: 16px;
    bottom: -5px;
    border: 2px solid ${(props) => props.theme.colors.icon40};
    background-color: ${(props) => props.theme.colors.layer};

    &.rc-slider-dot-active {
      border: 4px solid ${(props) => props.theme.colors.primary};
    }

    &:last-of-type {
      transform: translateX(0) !important;
    }
  }

  .rc-slider-handle {
    border: solid 4px ${(props) => props.theme.colors.primary} !important;
    width: 24px;
    height: 24px;
    margin-top: -9px;
    opacity: 1;
    box-shadow: none !important;
    background-color: ${(props) => props.theme.colors.layer};

    &:hover {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }

  .rc-slider-mark {
    top: 22px;
    left: -3px !important;
  }

  .rc-slider-mark-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: ${(props) => props.theme.colors.text40};
  }
`;

const handleRender = (origin, pros) => {
  return (
    <Tooltip placement="top" title={pros.value}>
      {origin}
    </Tooltip>
  );
};

/**
 * Slider
 * @mui/Slider 的 bable/runtime 编译报错，所以重新搞个 rc-slider
 * 需要安装 rc-trigger, 不然 tooltip 不生效
 */
const Slider = (props) => {
  const { ...restProps } = props;
  const isRTL = useIsRTL();

  return (
    <SliderWrapper handleRender={handleRender} reverse={isRTL} {...restProps} />
  );
};

export default memo(Slider);
