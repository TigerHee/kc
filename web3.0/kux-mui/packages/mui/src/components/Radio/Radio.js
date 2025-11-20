/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { isPropValid } from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { RadioGroupContext, RadioTypeContext } from 'context/index';
import composeRef from 'utils/composeRef';
import { composeClassNames } from 'styles/index';
import clsx from 'clsx';
import RadioBase from './RadioBase';

import getRadioClassName from './className';

const useClassName = (state) => {
  const { classNames: classNamesFromProps, size, checked, isButtonType, disabled } = state;
  const slots = {
    wrapper: [
      'wrapper',
      isButtonType && 'button-wrapper',
      isButtonType && size && `${size}-wrapper`,
      checked && `wrapper-checked`,
      disabled && 'wrapper-disabled',
      size && `${size}-wrapper`,
    ],
    text: ['text'],
  };

  return composeClassNames(slots, getRadioClassName, classNamesFromProps);
};

const Label = styled('label', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, disabled, isButtonType, size, checked }) => {
  return {
    ...(isButtonType
      ? {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          listStyle: 'none',
          fontFamily: theme.fonts.family,
          boxSizing: 'border-box',
          margin: '0 8px 0 0',
          opacity: disabled ? 0.4 : 1,
          color: checked ? theme.colors.primary : theme.colors.text60,
          background: checked ? theme.colors.primary8 : theme.colors.cover4,
          '&:hover': {
            background: !disabled && !checked && theme.colors.cover2,
          },
          ...(size === 'large' && {
            height: '40px',
            padding: '0 12px',
            borderRadius: theme.radius.basic,
            fontSize: '16px',
          }),
          ...(size === 'middle' && {
            height: '32px',
            padding: '0 8px',
            borderRadius: theme.radius.basic,
            fontSize: '14px',
          }),
          ...(size === 'small' && {
            height: '24px',
            padding: '0 8px',
            borderRadius: theme.radius.small,
            fontSize: '12px',
          }),
        }
      : {
          boxSizing: 'border-box',
          margin: '0 20px 0 0',
          padding: 0,
          fontSize: '14px',
          color: theme.colors.text,
          listStyle: 'none',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
        }),
  };
});

const TextBox = styled.span`
  display: inline-block;
  margin-left: ${(props) => (props.isButtonType ? 0 : props.size === 'small' ? '4px' : '8px')};
`;

const Radio = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const innerRef = React.useRef();
  const mergedRef = composeRef(ref, innerRef);
  const context = React.useContext(RadioGroupContext);

  const typeContext = React.useContext(RadioTypeContext);

  const {
    children,
    disabled,
    value,
    checked,
    type,
    name,
    onChange: onChangeFromProp,
    className,
    classNames: classNamesFromProps,
    ...restProps
  } = props;

  const isButtonType = context?.radioType === 'button' || typeContext === 'button';

  const onChange = (e) => {
    onChangeFromProp?.(e);
    context?.onChange?.(e);
  };

  const radioProps = {
    disabled,
    value,
    checked,
    name,
    type,
  };

  if (context) {
    radioProps.name = context.name;
    radioProps.onChange = onChange;
    radioProps.checked = props.value === context.value;
    radioProps.disabled = props.disabled || context.disabled;
    radioProps.size = context.size;
  }

  const _classNames = useClassName({
    classNames: classNamesFromProps,
    isButtonType,
    checked: radioProps.checked,
    disabled: radioProps.disabled,
    size: radioProps.size,
  });

  return (
    <Label
      size={radioProps.size}
      theme={theme}
      className={clsx(_classNames.wrapper, className)}
      checked={radioProps.checked}
      disabled={radioProps.disabled}
      isButtonType={isButtonType}
      {...restProps}
    >
      <RadioBase
        {...radioProps}
        classNames={classNamesFromProps}
        isButtonType={isButtonType}
        type="radio"
        ref={mergedRef}
      />
      {children !== undefined ? (
        <TextBox isButtonType={isButtonType} className={_classNames.text} size={radioProps.size}>
          {children}
        </TextBox>
      ) : null}
    </Label>
  );
});

Radio.displayName = 'Radio';

Radio.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
};

Radio.defaultProps = {
  disabled: false,
  checked: false,
};

export default Radio;
