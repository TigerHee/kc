/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { variant } from 'styled-system';
import { ErrorOutlined, SuccessOutlined } from '@kux/icons';
import { fade } from 'utils/colorManipulator';
import clsx from 'clsx';
import useClassNames from './useClassNames';

import { validProgress } from './aux';

const LineProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const LineProgressOuter = styled.div`
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
  background: ${(props) => fade(props.theme.colors.icon, 0.12)};
  ${variant({
    prop: 'size',
    variants: {
      small: {
        height: '4px',
      },
      basic: {
        height: '8px',
      },
    },
  })};
`;

const LineProgressInner = styled.div`
  height: 100%;
  border-radius: 8px;
  width: ${(props) => props.width}%;
  transition: ${(props) => props.theme.transitions.create()};
  background: ${(props) => props.theme.colors.icon};
  ${(props) =>
    variant({
      prop: 'status',
      variants: {
        error: {
          background: props.theme.colors.secondary,
        },
        finish: {
          background: props.theme.colors.primary,
        },
      },
    })};
`;

const InfoBox = styled.div`
  width: 38px;
  margin-left: 10px;
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

const LineProgress = React.forwardRef(
  ({ percent, size, error, showInfo, format, className, ...props }, ref) => {
    const theme = useTheme();
    const width = validProgress(percent);

    const _classNames = useClassNames();

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
          <ErrorOutlined
            className={_classNames.infoStatus}
            color={theme.colors.secondary}
            size={size === 'small' ? 10 : 14}
          />
        );
      }
      if (status === 'finish') {
        return (
          <SuccessOutlined
            className={_classNames.infoStatus}
            color={theme.colors.primary}
            size={size === 'small' ? 10 : 14}
          />
        );
      }
      return (
        <InfoText theme={theme} size={size} className={_classNames.infoText}>
          {width}%
        </InfoText>
      );
    }, [format, status, theme, size, width, percent, _classNames]);

    return (
      <LineProgressWrapper ref={ref} className={clsx(_classNames.wrapper)}>
        <LineProgressOuter
          theme={theme}
          size={size}
          {...props}
          className={clsx(_classNames.outer, className)}
        >
          <LineProgressInner
            status={status}
            width={width}
            theme={theme}
            className={_classNames.inner}
          />
        </LineProgressOuter>
        {showInfo ? <InfoBox className={_classNames.info}>{info}</InfoBox> : null}
      </LineProgressWrapper>
    );
  },
);

LineProgress.displayName = 'LineProgress';

LineProgress.propTypes = {
  size: PropTypes.oneOf(['small', 'basic']),
  percent: PropTypes.number,
  error: PropTypes.bool,
  showInfo: PropTypes.bool,
  format: PropTypes.func,
};

LineProgress.defaultProps = {
  size: 'basic',
  percent: 0,
  error: false,
  showInfo: true,
};

export default LineProgress;
