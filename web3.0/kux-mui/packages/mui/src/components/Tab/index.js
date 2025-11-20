/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import clsx from 'clsx';
import useClassNames from './useClassNames';
import { LineTab, BorderedTab, SliderTab } from './kux';

const tabMap = {
  line: LineTab,
  bordered: BorderedTab,
  slider: SliderTab,
};

const Tab = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const {
    className,
    indicator,
    label,
    onChange,
    onClick,
    onFocus,
    selected,
    value,
    variant,
    size,
    activeType,
    type,
    ...other
  } = props;

  const ownerState = {
    ...other,
    selected,
    label,
  };

  const handleClick = (event) => {
    if (!selected && onChange) {
      onChange(event, value);
    }

    if (onClick) {
      onClick(event);
    }
  };

  const handleFocus = (event) => {
    if (!selected && onChange) {
      onChange(event, value);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  const Component = tabMap[variant];

  const _classNames = useClassNames({ variant, selected });

  return (
    <Component
      ref={ref}
      role="tab"
      theme={theme}
      aria-selected={selected}
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={selected ? 0 : -1}
      className={clsx(_classNames.TabItem, className)}
      size={size}
      variant={variant}
      activeType={activeType}
      type={type}
      {...ownerState}
    >
      {label}
      {indicator}
    </Component>
  );
});

Tab.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.any,
};

export default Tab;
