/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import useMergedState from 'hooks/useMergedState';

const BaseInputRoot = styled.input`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: inherit;
  opacity: 0;
  margin: 0;
`;

const BaseInput = React.forwardRef((props, ref) => {
  const {
    name,
    id,
    type,
    disabled,
    readOnly,
    tabIndex,
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyPress,
    onKeyUp,
    value,
    required,
    onChange,
    ...others
  } = props;
  const [checked, setChecked] = useMergedState(props.defaultChecked, {
    value: props.checked,
  });

  const handleChange = (event) => {
    if (disabled) {
      return;
    }
    const newChecked = event.target.checked;
    if (!('checked' in props)) {
      setChecked(newChecked);
    }
    if (onChange) {
      onChange({
        target: {
          ...props,
          checked: newChecked,
        },
        stopPropagation() {
          event.stopPropagation();
        },
        preventDefault() {
          event.preventDefault();
        },
        nativeEvent: event.nativeEvent,
      });
    }
  };

  const globalProps = Object.keys(others).reduce((prev, key) => {
    if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
      prev[key] = others[key];
    }
    return prev;
  }, {});

  return (
    <BaseInputRoot
      name={name}
      ref={ref}
      id={id}
      type={type}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      tabIndex={tabIndex}
      checked={!!checked}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
      onChange={handleChange}
      {...(type === 'checkbox' && value === undefined ? {} : { value })}
      {...others}
      {...globalProps}
    />
  );
});

export default BaseInput;
