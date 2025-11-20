/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useResponsive from 'hooks/useResponsive';
import styled, { isPropValid } from 'emotion/index';
import { RowContext } from 'context/index';
import classNames from 'clsx';
import { composeClassNames } from 'styles/index';
import useFlexGapSupport from './aux';
import { getRowClassName } from './classNames';

const RowRoot = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})((props) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: props.isWrap ? 'wrap' : 'nowrap',
    ...(props.justify && {
      justifyContent: props.justify,
    }),
    ...(props.align && {
      alignItems: props.align,
    }),
    '&::before, &::after': {
      display: 'flex',
    },
  };
});

const useClassNames = (state) => {
  const { classNames: classNamesFromProps } = state;
  const slots = {
    row: ['row'],
  };
  return composeClassNames(slots, getRowClassName, classNamesFromProps);
};

const Row = React.forwardRef((props, ref) => {
  const {
    justify,
    align,
    style = {},
    children,
    gutter = 0,
    wrap = true,
    className,
    ...others
  } = props;

  const screens = useResponsive();

  const responsiveArray = Object.keys(screens);

  const supportFlexGap = useFlexGapSupport();

  const getGutter = () => {
    const results = [0, 0];
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
    normalizedGutter.forEach((g, index) => {
      if (typeof g === 'object') {
        for (let i = 0; i < responsiveArray.length; i++) {
          const breakpoint = responsiveArray[i];
          if (screens[breakpoint] && g[breakpoint] !== undefined) {
            results[index] = g[breakpoint];
          }
        }
      } else {
        results[index] = g || 0;
      }
    });
    return results;
  };

  const gutters = getGutter();

  const rowStyle = {};
  const horizontalGutter = gutters[0] > 0 ? gutters[0] / -2 : undefined;
  const verticalGutter = gutters[1] > 0 ? gutters[1] / -2 : undefined;
  if (horizontalGutter) {
    rowStyle.marginLeft = horizontalGutter;
    rowStyle.marginRight = horizontalGutter;
  }

  if (supportFlexGap) {
    [, rowStyle.rowGap] = gutters;
  } else if (verticalGutter) {
    rowStyle.marginTop = verticalGutter;
    rowStyle.marginBottom = verticalGutter;
  }

  const [gutterH, gutterV] = gutters;

  const rowContextValue = React.useMemo(
    () => ({ gutter: [gutterH, gutterV], screens, wrap, supportFlexGap }),
    [gutterH, gutterV, wrap, supportFlexGap, screens],
  );

  const commonState = {
    justify,
    align,
    isWrap: wrap,
  };

  const _classNames = useClassNames({ ...others });

  return (
    <RowContext.Provider value={rowContextValue}>
      <RowRoot
        {...others}
        {...commonState}
        style={{ ...rowStyle, ...style }}
        ref={ref}
        className={classNames(className, _classNames.row)}
      >
        {children}
      </RowRoot>
    </RowContext.Provider>
  );
});

Row.displayName = 'Row';

Row.propTypes = {
  justify: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-around', 'space-between']),
  align: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'baseline', 'stretch']),
  gutter: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.object]),
  style: PropTypes.object,
  children: PropTypes.node,
  wrap: PropTypes.bool,
};

Row.defaultProps = {
  wrap: true,
  justify: 'flex-start',
  align: 'flex-start',
  gutter: 0,
};

export default Row;
