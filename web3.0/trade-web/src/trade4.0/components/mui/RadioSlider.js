/**
 * Owner: garuda@kupotech.com
 */
import { Slider, styled } from '@kux/mui';
import React from 'react';
import { useIsRTL } from 'src/trade4.0/hooks/common/useLang';

const RadioSliderCls = styled(Slider)`
  height: 40px !important;
  padding: 24px 0 0 !important;

  &.rc-slider {
    width: 96%;
    margin: 0 auto;
    .rc-slider-tooltip {
      /* @noflip */
      right: initial;
      .rc-slider-tooltip-inner {
        height: 20px;
        min-height: 20px;
        padding: 2px 5px;
        font-size: 12px;
      }
      .rc-slider-tooltip-arrow {
        display: none;
      }
    }
    .rc-slider-tooltip-placement-top {
      padding: 4px 0 0 0;
    }
  }

  .rc-slider-rail {
    height: 4px !important;
    background-color: ${(props) => props.theme.colors.divider8} !important;
  }

  .rc-slider-track {
    height: 4px !important;
    background: ${(props) => props.theme.colors.primary} !important;
  }

  .rc-slider-mark {
    top: 32px;
  }

  .rc-slider-step {
    height: 4px;

    .rc-slider-dot {
      bottom: -3px;
      width: 10px;
      height: 10px;
      margin: -4px 0 0 -5px;
      background: ${(props) => props.theme.colors.layer};
      border: none;
      border: 2px solid ${(props) => props.theme.colors.icon40};
      border-radius: 50%;
      opacity: 1;
    }

    .rc-slider-dot-active {
      border: 2px solid ${(props) => props.theme.colors.primary};
    }
  }

  .rc-slider-handle {
    width: 16px;
    height: 16px;
    margin: -6px 0 0;
    background: ${(props) => props.theme.colors.layer};
    border: 4px solid ${(props) => props.theme.colors.primary};

    &.focusVisible {
      box-shadow: none;
    }

    &:hover {
      box-shadow: none;
    }

    &:active {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }

  .rc-slider-tooltip-inner {
    box-shadow: none;
  }

  .rc-slider-tooltip .rc-slider-tooltip-arrow {
    border-top-color: #2e3034;
  }

  .rc-slider-tooltip .rc-slider-tooltip-inner {
    color: #f3f3f3;
    background-color: #2e3034;
  }

  .rc-slider-mark-text-active {
    top: 0;
    color: ${(props) => props.theme.colors.text40};
  }

  .thumb {
    width: 14px;
    height: 14px;
    margin: -6px 0 0 -6px;
    background-color: ${(props) => props.theme.colors.base};
    border: 2px solid ${(props) => props.theme.colors.primary};

    &.focusVisible {
      box-shadow: none;
    }

    &:hover {
      box-shadow: none;
    }
  }

  .valueLabel {
    top: -15px;

    > span {
      width: auto;
      height: 18px;
      padding: 0 8px;
      line-height: 18px;
      background-color: ${(props) => props.theme.colors.primary};
      border-radius: 2px;
      transform: none;
      transform: none;

      &::after {
        border-top-color: ${(props) => props.theme.colors.primary};
      }
    }
  }

  .track {
    height: 4px;
  }

  .rail {
    height: 4px;
    background-color: ${(props) => props.theme.colors.divider8};
  }

  .mark {
    width: 10px;
    height: 10px;
    margin: -4px 0 0 -5px;
    background: ${(props) => props.theme.colors.layer};
    border-radius: 50%;
    opacity: 1;
  }

  .marked {
    margin: 0 0 16px;
  }

  .markLabel {
    margin: 0 0 0 4px;
    font-size: 12px;
  }

  .markActive {
    background: ${(props) => props.theme.colors.primary};
  }
`;

const RadioSlider = (props) => {
  const isRTL = useIsRTL();
  return <RadioSliderCls reverse={isRTL} {...props} />;
};

export default React.memo(RadioSlider);
