/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback } from 'react';
import styled, { isPropValid } from 'emotion/index';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import _ from 'lodash-es';
import { ICClosePlusOutlined, ICCheckboxArrowOutlined, ICArrowRightOutlined } from '@kux/icons';
import { composeClassNames } from 'styles/index';
import classNames from 'clsx';
import { getStepClassName } from './classNames';

const StepItem = styled('li', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ direction, size, labelPlacement, active, type }) => {
  return {
    flex: type === 'simple' ? 'unset' : 1,
    display: 'block',
    position: 'relative',
    ...(direction === 'horizontal' && {
      ...(labelPlacement === 'horizontal' && {
        overflow: 'hidden',
        '&:last-of-type': {
          flex: 'none',
        },
        '&:not(:first-of-type)': {
          ...(size === 'small' && {
            marginLeft: '12px',
          }),
          ...(size === 'basic' && {
            marginLeft: '24px',
          }),
        },
      }),
      ...(labelPlacement === 'vertical' && {
        ...(size === 'small' && {
          padding: '0 6px',
        }),
        ...(size === 'basic' && {
          padding: '0 12px',
        }),
      }),
    }),
    ...(direction === 'vertical' && {
      overflow: 'hidden',
      '&:last-of-type': {
        flex: 'none',
      },
    }),
    '&[role="button"]': {
      ...(!active && {
        cursor: 'pointer',
      }),
    },
    '&:last-of-type': {
      '.KuxStep-arrowRight': {
        display: 'none',
      },
    },
  };
});

const StepItemContainer = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ direction, labelPlacement }) => {
  return {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    ...(direction === 'horizontal' &&
      labelPlacement === 'vertical' && {
        display: 'block',
      }),
  };
});

const Tail = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ direction, labelPlacement, hasTail, theme, size, status }) => {
  return {
    ...(direction === 'horizontal' && {
      display: 'none',
      ...(labelPlacement === 'vertical' &&
        hasTail && {
          display: 'block',
          position: 'absolute',
          left: 0,
          top: size === 'small' ? '12px' : '24px',
          marginLeft: size === 'small' ? 'calc(50% + 12px)' : 'calc(50% + 24px)',
          width: '100%',
          '&:after': {
            display: 'block',
            position: 'absolute',
            content: '""',
            width: size === 'small' ? 'calc(100% - 12px)' : 'calc(100% - 24px)',
            height: '1px',
            background: status === 'finish' ? theme.colors.primary : theme.colors.divider8,
          },
        }),
    }),
    ...(direction === 'vertical' &&
      hasTail && {
        display: 'block',
        position: 'absolute',
        left: size === 'small' ? '12px' : '24px',
        top: size === 'small' ? '24px' : '48px',
        height: `calc(100% - ${size === 'small' ? '24px' : '48px'})`,
        width: '1px',
        '&:after': {
          display: 'block',
          position: 'absolute',
          content: '""',
          width: '1px',
          height: '100%',
          background: status === 'finish' ? theme.colors.primary : theme.colors.divider8,
        },
      }),
  };
});

const IconBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ size, status, theme, direction, labelPlacement, type }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: '100%',
    fontWeight: 600,
    fontFamily: theme.fonts.family,
    ...(size === 'small' && {
      width: '24px',
      height: '24px',
      fontSize: '14px',
    }),
    ...(size === 'basic' && {
      width: '48px',
      height: '48px',
      fontSize: '20px',
    }),
    ...(status === 'finish' && {
      background: theme.colors.primary12,
      color: theme.colors.primary,
      ...(type === 'simple' && {
        background: theme.colors.text,
        color: theme.colors.textEmphasis,
      }),
    }),
    ...(status === 'process' && {
      background: theme.colors.primary,
      color: theme.colors.base,
      ...(type === 'simple' && {
        background: theme.colors.text,
        color: theme.colors.textEmphasis,
      }),
    }),
    ...(status === 'wait' && {
      border: `1px solid ${theme.colors.divider8}`,
      background: theme.colors.base,
      color: theme.colors.text60,
      ...(type === 'simple' && {
        background: theme.colors.text20,
        color: theme.colors.textEmphasis,
      }),
    }),
    ...(status === 'error' && {
      background: theme.colors.secondary,
      color: theme.colors.base,
    }),
    ...(direction === 'horizontal' && {
      ...(labelPlacement === 'vertical' && {
        margin: 'auto',
      }),
    }),
  };
});

const ContentBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ size, labelPlacement, direction }) => {
  return {
    ...(direction === 'vertical' && {
      ...(size === 'small' && {
        marginLeft: '12px',
      }),
      ...(size === 'basic' && {
        marginLeft: '16px',
      }),
      marginBottom: '40px',
    }),
    ...(direction === 'horizontal' && {
      ...(labelPlacement === 'horizontal' && {
        ...(size === 'small' && {
          marginLeft: '12px',
        }),
        ...(size === 'basic' && {
          marginLeft: '16px',
        }),
      }),
      ...(labelPlacement === 'vertical' && {
        textAlign: 'center',
      }),
    }),
  };
});

const Title = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ size, theme, direction, hasTail, labelPlacement, status, type }) => {
  return {
    fontWeight: 500,
    fontFamily: theme.fonts.family,
    color: theme.colors.text,
    ...(size === 'small' && {
      fontSize: '14px',
      lineHeight: '24px',
    }),
    ...(size === 'basic' && {
      fontSize: '24px',
      lineHeight: '48px',
    }),
    display: 'inline-block',
    position: 'relative',
    '&:after': {
      ...(direction === 'horizontal' &&
        hasTail &&
        type !== 'simple' &&
        labelPlacement === 'horizontal' && {
          position: 'absolute',
          content: '""',
          top: '50%',
          left: `calc(100% + ${size === 'small' ? '12px' : '24px'})`,
          display: 'block',
          width: '9999px',
          height: '1px',
          background: status === 'finish' ? theme.colors.primary : theme.colors.divider8,
        }),
    },
  };
});

const Content = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ size, theme, status, direction }) => {
  return {
    fontWeight: 400,
    fontFamily: theme.fonts.family,
    color: theme.colors.text60,
    ...(size === 'small' && {
      fontSize: '12px',
      lineHeight: '16px',
    }),
    ...(size === 'basic' && {
      fontSize: '16px',
      lineHeight: '22px',
    }),
  };
});

const ICArrowRight = styled(ICArrowRightOutlined)`
  align-self: center;
  margin-left: 12px;
  [dir='rtl'] & {
    transform: rotate(180deg);
  }
`;

const useClassNames = (state) => {
  const { className: classNamesFromProps, size, direction, labelPlacement, status, active } = state;
  const slots = {
    step: [
      'step',
      size && `${size}Step`,
      direction && `${direction}Step`,
      labelPlacement && `${labelPlacement}Step`,
      status && `${status}Step`,
      active && `ActiveStep`,
    ],
    container: ['container'],
    tail: ['tail'],
    icon: ['icon'],
    stepContent: ['stepContent'],
    title: ['title'],
    content: ['content'],
    arrowRight: ['arrowRight'],
  };
  return composeClassNames(slots, getStepClassName, classNamesFromProps);
};

const Step = React.forwardRef((props, ref) => {
  const {
    title,
    description,
    direction,
    status,
    icon,
    stepNumber,
    size,
    labelPlacement,
    hasTail,
    onClick,
    onStepClick,
    stepIndex,
    active,
    className,
    type,
    ...others
  } = props;
  const theme = useTheme();
  const iconNode = React.useMemo(() => {
    let node = null;
    if (icon && !_.isString(icon)) {
      node = icon;
    } else if (status === 'finish') {
      node = <ICCheckboxArrowOutlined size={size === 'small' ? 14 : 24} />;
    } else if (status === 'error') {
      node = <ICClosePlusOutlined size={size === 'small' ? 14 : 16} />;
    } else {
      node = stepNumber;
    }
    return node;
  }, [icon, status, stepNumber]);

  const handleStepClick = useCallback(
    (...args) => {
      if (onStepClick) {
        onStepClick(stepIndex);
      }
      if (onClick) {
        onClick(args);
      }
    },
    [onClick, onStepClick, stepIndex],
  );

  const accessibilityProps = {};

  if (onStepClick) {
    accessibilityProps.onClick = handleStepClick;
    accessibilityProps.role = 'button';
  }

  const _classNames = useClassNames({ ...props });

  return (
    <StepItem
      {...others}
      {...accessibilityProps}
      type={type}
      active={active}
      direction={direction}
      labelPlacement={labelPlacement}
      size={size}
      className={classNames(className, _classNames.step)}
      ref={ref}
    >
      <StepItemContainer
        className={_classNames.container}
        labelPlacement={labelPlacement}
        direction={direction}
      >
        {type !== 'simple' && (
          <Tail
            className={_classNames.tail}
            hasTail={hasTail}
            theme={theme}
            labelPlacement={labelPlacement}
            direction={direction}
            size={size}
            status={status}
          />
        )}
        <IconBox
          direction={direction}
          labelPlacement={labelPlacement}
          size={size}
          theme={theme}
          status={status}
          className={_classNames.icon}
          type={type}
        >
          {iconNode}
        </IconBox>

        <ContentBox
          className={_classNames.stepContent}
          direction={direction}
          size={size}
          labelPlacement={labelPlacement}
        >
          <Title
            labelPlacement={labelPlacement}
            hasTail={hasTail}
            direction={direction}
            size={size}
            theme={theme}
            status={status}
            className={_classNames.title}
            type={type}
          >
            {title}
          </Title>
          <Content
            className={_classNames.content}
            direction={direction}
            size={size}
            status={status}
            theme={theme}
          >
            {description}
          </Content>
        </ContentBox>
        {type === 'simple' && (
          <ICArrowRight
            className={_classNames.arrowRight}
            size={size === 'small' ? 16 : 24}
            color={theme.colors.text30}
          />
        )}
      </StepItemContainer>
    </StepItem>
  );
});

Step.propTypes = {
  description: PropTypes.node,
  icon: PropTypes.node,
  status: PropTypes.oneOf(['finish', 'process', 'wait', 'error']),
  title: PropTypes.node,
};

Step.defaultProps = {};

Step.displayName = 'Step';

export default Step;
