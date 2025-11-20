/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';

import styled, { isPropValid } from 'emotion/index';
import toArray from 'utils/toArray';

import { composeClassNames } from 'styles/index';
import classNames from 'clsx';
import Step from './Step';

import getStepsClassName from './classNames';

const StepContainer = styled('ol', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ direction }) => {
  return {
    display: 'flex',
    listStyle: 'none',
    marginBlockStart: '0px',
    marginBlockEnd: '0px',
    marginInlineStart: '0px',
    marginInlineEnd: '0px',
    paddingInlineStart: '0px',
    ...(direction === 'vertical' && {
      flexDirection: 'column',
    }),
  };
});

const useClassNames = (state) => {
  const { className: classNamesFromProps, size, direction, labelPlacement } = state;
  const slots = {
    steps: [
      'steps',
      size && `${size}Steps`,
      direction && `${direction}Steps`,
      labelPlacement && `${labelPlacement}Steps`,
    ],
  };
  return composeClassNames(slots, getStepsClassName, classNamesFromProps);
};

const Steps = React.forwardRef(
  (
    { children, onChange, current, direction, status, size, labelPlacement, className, type },
    ref,
  ) => {
    const childList = toArray(children);

    const onStepClick = (next) => {
      if (onChange && current !== next) {
        onChange(next);
      }
    };

    const _classNames = useClassNames({ direction, size, labelPlacement });

    return (
      <StepContainer
        className={classNames(className, _classNames.steps)}
        direction={direction}
        ref={ref}
      >
        {childList.map((child, childIndex) => {
          const stepIndex = childIndex;
          const hasTail = childIndex + 1 < childList.length;
          const childProps = {
            stepIndex,
            stepNumber: `${stepIndex + 1}`,
            key: stepIndex,
            direction,
            onStepClick: onChange && onStepClick,
            size,
            hasTail,
            labelPlacement,
            type,
            ...child.props,
          };
          if (!child.props.status) {
            if (stepIndex === current) {
              if (status) {
                childProps.status = status;
              } else {
                childProps.status = 'process';
              }
            } else if (stepIndex < current) {
              childProps.status = 'finish';
            } else {
              childProps.status = 'wait';
            }
          }
          childProps.active = current === childIndex;
          return React.cloneElement(child, childProps);
        })}
      </StepContainer>
    );
  },
);

Steps.Step = Step;

Steps.propTypes = {
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  labelPlacement: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['small', 'basic']),
  onChange: PropTypes.func,
  current: PropTypes.number,
  status: PropTypes.oneOf(['finish', 'process', 'wait', 'error']),
  type: PropTypes.oneOf(['normal', 'simple']), // 普通版 简约版为黑色
};

Steps.defaultProps = {
  direction: 'horizontal',
  labelPlacement: 'horizontal',
  size: 'basic',
  current: 0,
  type: 'normal',
};

Steps.displayName = 'Steps';

export default Steps;
