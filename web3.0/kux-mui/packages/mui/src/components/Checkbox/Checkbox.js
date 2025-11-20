/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { CheckBoxGroupContext } from 'context/index';
import { composeRef } from 'utils/index';
import PropTypes from 'prop-types';
import { composeClassNames } from 'styles/index';
import CheckBoxBase from './CheckBoxBase';
import getCheckboxClassName from './classNames';

const Label = styled.label`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: ${(props) => props.theme.fonts.family};
  color: ${(props) => props.theme.colors.text};
  list-style: none;
  position: relative;
  display: inline-block;
  line-height: unset;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
  &:not(:last-of-type) {
    margin-right: ${(props) => (props.isGroup ? '20px' : 0)};
  }
  &:after {
    display: inline-block;
    width: 0;
    overflow: hidden;
    content: '\a0';
  }
`;

const TextWrap = styled.span`
  margin-left: 6px;
  font-size: 14px;
  line-height: 22px;
`;

const useClassNames = (state) => {
  const { classNames: classNamesFromProps, isGroup, checked, disabled, indeterminate } = state;
  const slots = {
    wrapper: [
      'wrapper',
      isGroup && 'wrapper-group',
      checked && 'wrapper-checked',
      disabled && 'wrapper-disabled',
    ],
    checkbox: [
      'checkbox',
      checked && 'checked',
      disabled && 'disabled',
      indeterminate && 'indeterminate',
    ],
    inner: ['inner'],
    input: ['input'],
  };
  return composeClassNames(slots, getCheckboxClassName, classNamesFromProps);
};

const Checkbox = React.forwardRef((props, ref) => {
  const { children, isGroup, classNames: classNamesFromProps, indeterminate, className, ...restProps } = props;
  const theme = useTheme();
  const innerRef = React.useRef();
  const mergedRef = composeRef(ref, innerRef);
  const context = React.useContext(CheckBoxGroupContext);

  const prevValue = React.useRef(restProps.value);

  React.useEffect(() => {
    context?.registerValue(restProps.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (restProps.value !== prevValue.current) {
      context?.cancelValue(prevValue.current);
      context?.registerValue(restProps.value);
      prevValue.current = restProps.value;
    }
    return () => context?.cancelValue(restProps.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restProps.value]);

  const checkboxProps = { ...restProps };

  if (context) {
    checkboxProps.onChange = (...arg) => {
      if (restProps.onChange) {
        restProps.onChange(...arg);
      }
      if (context.toggleOption) {
        context.toggleOption({ label: children, value: restProps.value });
      }
    };
    checkboxProps.name = context.name;
    checkboxProps.checked = context.value.indexOf(restProps.value) !== -1;
    checkboxProps.disabled = restProps.disabled || context.disabled;
  }

  const _classNames = useClassNames({
    classNames: classNamesFromProps,
    isGroup,
    checked: checkboxProps.checked,
    disabled: checkboxProps.disabled,
    indeterminate,
  });

  return (
    <Label
      className={clsx(_classNames.wrapper, className)}
      isGroup={isGroup}
      theme={theme}
      disabled={checkboxProps.disabled}
    >
      <CheckBoxBase
        {...checkboxProps}
        classNames={_classNames}
        indeterminate={indeterminate}
        ref={mergedRef}
        type="checkbox"
      />
      {children !== undefined ? <TextWrap>{children}</TextWrap> : null}
    </Label>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  checkOptions: PropTypes.object,
  size: PropTypes.oneOf(['basic', 'small', 'large'])
};

// checkedType = 1 已废弃

export default Checkbox;
