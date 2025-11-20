/**
 * Owner: willen@kupotech.com
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@kufox/mui';
import { useTheme } from '@kufox/mui';

const TabRoot = styled.div`
  overflow: hidden;
  flex-shrink: 0;
  text-align: center;
  white-space: normal;
  padding: 0 20px;
  cursor: pointer;
  font-family: ${(props) => props.theme.fonts.family};
  font-size: 14px;
  line-height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: 0;
  box-sizing: border-box;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
`;

const LineTab = styled(TabRoot)`
  color: ${(props) => (props.selected ? props.theme.colors.text : props.theme.colors.text60)};
  font-weight: 400;
  height: 40px;
  padding: 0;
  &:not(:first-of-type) {
    margin-left: 32px;
  }
`;

const BorderedTab = styled(TabRoot)`
  font-weight: 500;
  color: ${(props) => (props.selected ? props.theme.colors.textEmphasis : props.theme.colors.text)};
  background: ${(props) => props.selected && props.theme.colors.primary};
  border-radius: 18px;
  height: 36px;
`;

const CardTab = styled(TabRoot)`
  background: ${(props) => (props.selected ? props.theme.colors.base : props.theme.colors.cover4)};
  font-weight: 500;
  height: 40px;
  color: ${(props) => (props.selected ? props.theme.colors.primary : props.theme.colors.text)};
`;

const tabMap = {
  line: LineTab,
  bordered: BorderedTab,
  card: CardTab,
};

const Tab = React.forwardRef(function Tab(props, ref) {
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
    ...other
  } = props;

  const ownerState = {
    ...props,
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

  return (
    <Component
      ref={ref}
      role="tab"
      theme={theme}
      aria-selected={selected}
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={selected ? 0 : -1}
      {...ownerState}
      {...other}
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
