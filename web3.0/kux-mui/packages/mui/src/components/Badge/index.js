/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { variant } from 'styled-system';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';

import { composeClassNames } from 'styles/index';

import getBadgeClassName from './classNames';

const BadgeRoot = styled.span`
  display: inline-block;
  margin: 0;
  padding: 0;
  position: relative;
  box-sizing: border-box;
`;

const BadgeBadgeWrapper = styled.div`
  position: absolute;
  top: -6px;
  right: -10px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
`;

const BadgeBadge = styled.sup`
  overflow: hidden;
  padding: 0px 4px;
  line-height: 130%;
  text-align: center;
  white-space: nowrap;
  border-radius: 8px;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  font-family: ${(props) => props.theme.fonts.family};
  top: 0;
  ${(props) => {
    return variant({
      prop: 'status',
      variants: {
        success: {
          background: props.theme.colors.primary,
        },
        default: {
          background: props.theme.colors.secondary,
        },
      },
    });
  }};
`;

const useClassName = (state) => {
  const { classNames: classNamesFromProps } = state;
  const slots = {
    root: ['root'],
    dotWrapper: ['dotWrapper'],
    dot: ['dot'],
    count: ['count'],
  };
  return composeClassNames(slots, getBadgeClassName, classNamesFromProps);
};

const BadgeDotWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 3px;
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BadgeDot = styled.sup`
  width: 6px;
  height: 6px;
  background: ${(props) => props.theme.colors.secondary};
  border-radius: 50%;
  top: 0;
`;

const Badge = React.forwardRef(
  ({ children, count, dot, overflowCount, showZero, status, ...others }, ref) => {
    const theme = useTheme();
    const numberedDisplayCount = count > overflowCount ? `${overflowCount}+` : count;
    const isZero = numberedDisplayCount === '0' || numberedDisplayCount === 0;
    const showAsDot = dot && !isZero;
    const mergedCount = showAsDot ? '' : numberedDisplayCount;
    const isHidden = useMemo(() => {
      const isEmpty = mergedCount === null || mergedCount === undefined || mergedCount === '';
      return (isEmpty || (isZero && !showZero)) && !showAsDot;
    }, [mergedCount, isZero, showZero, showAsDot]);

    const _classNames = useClassName({ ...others });

    return (
      <BadgeRoot className={_classNames.root} status={status} theme={theme} ref={ref}>
        {children}
        {showAsDot ? (
          <BadgeDotWrapper className={_classNames.dotWrapper}>
            <BadgeDot className={_classNames.dot} status={status} theme={theme} />
          </BadgeDotWrapper>
        ) : (
          !isHidden && (
            <BadgeBadgeWrapper>
              <BadgeBadge className={_classNames.count} status={status} theme={theme}>
                {mergedCount}
              </BadgeBadge>
            </BadgeBadgeWrapper>
          )
        )}
      </BadgeRoot>
    );
  },
);

Badge.displayName = 'Badge';

Badge.propTypes = {
  count: PropTypes.number,
  overflowCount: PropTypes.number,
  showZero: PropTypes.bool,
  status: PropTypes.oneOf(['success', 'default']),
  dot: PropTypes.bool,
};

Badge.defaultProps = {
  overflowCount: 99,
  showZero: false,
  status: 'success',
  dot: false,
};

export default Badge;
