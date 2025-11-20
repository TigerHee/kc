/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import { RowContext } from 'context/index';
import PropTypes from 'prop-types';
import map from 'lodash-es/map';
import classNames from 'clsx';
import { composeClassNames } from 'styles/index';
import { getColClassName } from './classNames';

const changeNumberToPercent = (num) => {
  const decimal = ((num / 24) * 100).toFixed(6);
  return `${decimal}%`;
};

const ColRoot = styled(
  'div',
  {},
)((props) => {
  return {
    position: 'relative',
    minHeight: '1px',
    display: 'block',
    ...(props.span && {
      flex: `0 0 ${changeNumberToPercent(props.span)}`,
      maxWidth: changeNumberToPercent(props.span),
    }),
    ...(props.offset && {
      marginLeft: changeNumberToPercent(props.offset),
    }),
    ...(props.push && {
      left: changeNumberToPercent(props.push),
    }),
    ...(props.pull && {
      right: changeNumberToPercent(props.pull),
    }),
    ...(props.order && {
      order: props.order,
    }),
  };
});

function parseFlex(flex) {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`;
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }

  return flex;
}

const useClassNames = (state) => {
  const { classNames: classNamesFromProps, span, order, push, offset, pull } = state;
  const slots = {
    col: [
      'col',
      span && `${span}-col`,
      order && `${order}-col`,
      push && `${push}-col`,
      offset && `${offset}-col`,
      pull && `${pull}-col`,
    ],
  };

  return composeClassNames(slots, getColClassName, classNamesFromProps);
};

const Col = React.forwardRef((props, ref) => {
  const { gutter, wrap, supportFlexGap, screens } = React.useContext(RowContext);
  const { span, order, offset, push, pull, children, flex, style, className, ...others } = props;

  let sizeProp = {
    span,
    order,
    offset,
    push,
    pull,
  };

  map(screens, (value, screen) => {
    let _sizeProp = {};
    const propSize = props[screen];
    if (typeof propSize === 'number') {
      if (value) {
        _sizeProp.span = propSize;
      }
    } else if (typeof propSize === 'object') {
      if (value) {
        _sizeProp = { ...propSize };
      }
    }
    sizeProp = {
      ...sizeProp,
      ..._sizeProp,
    };
  });

  const mergedStyle = {};
  if (gutter && gutter[0] > 0) {
    const horizontalGutter = gutter[0] / 2;
    mergedStyle.paddingLeft = horizontalGutter;
    mergedStyle.paddingRight = horizontalGutter;
  }

  if (gutter && gutter[1] > 0 && !supportFlexGap) {
    const verticalGutter = gutter[1] / 2;
    mergedStyle.paddingTop = verticalGutter;
    mergedStyle.paddingBottom = verticalGutter;
  }

  if (flex) {
    mergedStyle.flex = parseFlex(flex);
    if (wrap === false && !mergedStyle.minWidth) {
      mergedStyle.minWidth = 0;
    }
  }

  const _classNames = useClassNames({ ...others, ...sizeProp });

  return (
    <ColRoot
      {...sizeProp}
      {...others}
      style={{ ...mergedStyle, ...style }}
      ref={ref}
      className={classNames(className, _classNames.col)}
    >
      {children}
    </ColRoot>
  );
});

Col.displayName = 'Col';

Col.propTypes = {
  span: PropTypes.number,
  offset: PropTypes.number,
  order: PropTypes.number,
  pull: PropTypes.number,
  push: PropTypes.number,
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  flex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Col.defaultProps = {
  offset: 0,
  order: 0,
  pull: 0,
  push: 0,
};

export default Col;
