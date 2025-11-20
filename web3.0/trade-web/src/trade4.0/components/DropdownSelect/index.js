/**
 * Owner: borden@kupotech.com
 */
import React, { useState, Fragment } from 'react';

import clsx from 'clsx';
import { find, map } from 'lodash';

import Dropdown from '@mui/Dropdown';

import { styleCombine } from '@/style/emotion';

import Arrow from './Arrow';


import * as styles from './style';

const Overlay = ({
  configs,
  v,
  onChange,
  setVisible,
  styleMap,
  onSelect,
  header,
  footer,
  ...otherProps
}) => {
  const { List, Header, Footer } = styleMap;
  const onClick = (value) => {
    return () => {
      if (v !== value) {
        onChange && onChange(value);
      }
      if (onSelect) {
        onSelect(value);
      }
      setVisible(false);
    };
  };
  return (
    <List v={v} {...otherProps}>
      {header ? <Header>{header}</Header> : null}
      {map(configs, ({ label, value, disabled }, index) => {
        const isActive = value === v;
        return (
          <div
            key={`${value}-${index}`}
            isActive={isActive}
            className={clsx('dropdown-item', {
              'active-dropdown-item': isActive,
              'disabled-dropdown-item': disabled,
            })}
            onClick={onClick(value, disabled)}
          >
            {typeof label === 'function' ? label() : label}
          </div>
        );
      })}
      {footer ? <Footer>{footer}</Footer> : null}
    </List>
  );
};

const DropdownSelect = ({
  configs,
  value: _value,
  placement = 'bottom-start',
  onChange = () => {},
  isShowArrow = true,
  optionLabelProp = 'label', // 回填到选择框的 option 的属性值，默认是 option 的label; 可自行指定
  extendStyle,
  overlayProps,
  renderLabel = (v) => v,
  disabled = false,
  showSelectCallback,
  ...others
}) => {
  const [visible, setVisible] = useState(false);
  const currentLabel = find(configs, ({ value }) => value === _value) || {};
  const visibleChange = (v) => {
    if (disabled) return;
    setVisible(v);
    if (v) {
      showSelectCallback && showSelectCallback();
    }
  };
  const styleMap = styleCombine(styles, extendStyle);
  const { Text, Icon } = styleMap;
  isShowArrow = isShowArrow && !disabled;
  return (
    <Dropdown
      visible={visible}
      trigger="click"
      onVisibleChange={visibleChange}
      overlay={
        visible ? (
          <Overlay
            styleMap={styleMap}
            onChange={onChange}
            setVisible={setVisible}
            configs={configs}
            v={_value}
            {...overlayProps}
          />
        ) : (
          <Fragment />
        )
      }
      placement={placement}
      {...others}
    >
      <Text className="dropdown-value">
        {renderLabel(
          (typeof currentLabel[optionLabelProp] === 'function'
            ? currentLabel[optionLabelProp]()
            : currentLabel[optionLabelProp]) || '',
        )}
      </Text>
      {isShowArrow ? (
        <Icon isActive={visible}>
          <Arrow />
        </Icon>
      ) : null}
    </Dropdown>
  );
};

DropdownSelect.defaultProps = {
  holdDropdown: true,
};

export default DropdownSelect;
