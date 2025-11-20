/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { ConfirmOutlined, ExclamationOutlined } from '@kux/icons';
import { variant } from 'styled-system';
import { fade } from 'utils/colorManipulator';
import { validProgress } from './aux';

const CircleWidth = {
  basic: 40,
  small: 24,
};

const StrokeArray = {
  basic: 252,
  small: 152,
};

const CircleProgressWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SvgWrapper = styled.svg`
  transform: rotate(-90deg);
  ${variant({
  prop: 'size',
  variants: {
    basic: {
      width: 90,
      height: 90,
    },
    small: {
      width: 58,
      height: 58,
    },
  },
})};
`;

const CircleWrapper = styled.circle`
  fill: none;
  transform: translate(4px, 4px);
  stroke-dasharray: ${(props) => StrokeArray[props.size]};
  stroke-dashoffset: ${(props) => StrokeArray[props.size]};
  stroke-linecap: round;
  transition: ${(props) => props.theme.transitions.create()};
  ${variant({
  prop: 'size',
  variants: {
    basic: {
      strokeWidth: 4,
    },
    small: {
      strokeWidth: 2,
    },
  },
})};
`;

const Circle1 = styled(CircleWrapper)`
  stroke-dashoffset: 0;
  stroke: ${(props) => fade(props.theme.colors.icon, 0.12)};
`;

const Circle2 = styled(CircleWrapper)`
  stroke-dashoffset: ${(props) =>
    StrokeArray[props.size] - (StrokeArray[props.size] * props.width) / 100};
  stroke: ${(props) => props.theme.colors.icon};
  ${(props) =>
    variant({
      prop: 'status',
      variants: {
        error: {
          stroke: props.theme.colors.secondary,
        },
        finish: {
          stroke: props.theme.colors.primary,
        },
      },
    })};
`;

const InfoBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoText = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.colors.text60};
  ${variant({
  prop: 'size',
  variants: {
    small: {
      fontSize: 12,
    },
    basic: {
      fontSize: 14,
    },
  },
})};
`;

const CircleProgress = React.forwardRef(
  ({ percent, size, error, showInfo, format, ...restProps }, ref) => {
    const theme = useTheme();
    const width = validProgress(percent);

    const status = useMemo(() => {
      if (error) return 'error';
      if (width < 100) return 'active';
      return 'finish';
    }, [error, width]);

    const info = useMemo(() => {
      if (typeof format === 'function') {
        return format(percent);
      }
      if (status === 'error') {
        return (
          <ExclamationOutlined color={theme.colors.secondary} size={size === 'small' ? 14 : 24} />
        );
      }
      if (status === 'finish') {
        return <ConfirmOutlined color={theme.colors.primary} size={size === 'small' ? 14 : 24} />;
      }
      return (
        <InfoText theme={theme} size={size}>
          {`${width}%`}
        </InfoText>
      );
    }, [status, theme, size, format, percent, width]);

    const circleProps = useMemo(
      () => ({
        cx: CircleWidth[size],
        cy: CircleWidth[size],
        r: CircleWidth[size],
        theme,
        width,
        status,
        size,
      }),
      [theme, width, size, status],
    );

    return (
      <CircleProgressWrapper size={size} ref={ref} {...restProps}>
        <SvgWrapper size={size}>
          <Circle1 {...circleProps} />
          <Circle2 {...circleProps} />
        </SvgWrapper>
        {showInfo ? <InfoBox>{info}</InfoBox> : null}
      </CircleProgressWrapper>
    );
  },
);

CircleProgress.displayName = 'CircleProgress';

CircleProgress.propTypes = {
  size: PropTypes.oneOf(['small', 'basic']),
  percent: PropTypes.number,
  error: PropTypes.bool,
  showInfo: PropTypes.bool,
  format: PropTypes.func,
};

CircleProgress.defaultProps = {
  size: 'basic',
  percent: 0,
  error: false,
  showInfo: true,
};

export default CircleProgress;
