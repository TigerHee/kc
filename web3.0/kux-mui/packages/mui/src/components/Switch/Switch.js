/**
 * Owner: victor.ren@kupotech.com
 */
import useTheme from 'hooks/useTheme';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import useMergedState from 'hooks/useMergedState';
import classNames from 'clsx';
import { composeClassNames } from 'styles/index';
import BaseInput from '../BaseInput';
import { SwitchContainer, SwitchIcon } from './StyledComps';

import getSwitchClassName from './classNames';

const useClassNames = (state) => {
  const { className: classNamesFromProps, size, checked, disabled } = state;
  const slots = {
    container: [
      'container',
      size && `${size}Container`,
      checked && 'checkedContainer',
      disabled && 'disabledContainer',
    ],
    input: ['input'],
    handle: ['handle'],
  };
  return composeClassNames(slots, getSwitchClassName, classNamesFromProps);
};

const Switch = React.forwardRef((props, ref) => {
  const { size, onChange, disabled, className, defaultChecked, ...rest } = props;
  const theme = useTheme();
  const [innerChecked, setInnerChecked] = useMergedState(defaultChecked, {
    value: props.checked,
  });

  const handleChange = useCallback(
    (e) => {
      if (!('checked' in props)) {
        setInnerChecked(e.target.checked);
      }
      if (onChange) {
        onChange(e.target.checked);
      }
    },
    [onChange, props, setInnerChecked],
  );

  const _classNames = useClassNames({ ...props, checked: innerChecked });

  return (
    <SwitchContainer className={classNames(className, _classNames.container)} ref={ref}>
      <BaseInput
        {...rest}
        className={_classNames.input}
        checked={innerChecked}
        disabled={disabled}
        onChange={handleChange}
        theme={theme}
        type="checkbox"
      />
      <SwitchIcon
        className={_classNames.handle}
        checked={innerChecked}
        theme={theme}
        size={size}
        disabled={disabled}
      />
    </SwitchContainer>
  );
});

Switch.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'basic', 'large']),
  onChange: PropTypes.func,
};

Switch.defaultProps = {
  size: 'basic',
  defaultChecked: false,
};

Switch.displayName = 'Switch';

export default Switch;
