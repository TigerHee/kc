/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import { MenuContext } from 'context/index';
import { ICNoviceGuideOutlined } from '@kux/icons';
import includes from 'lodash-es/includes';
import clsx from 'clsx';
import { MenuItemRoot, IconBox } from './kux';
import useClassNames from './useClassNames';

const MenuItem = React.forwardRef(
  ({ icon, children, className, eventKey, onClick, isSub, layer, ...rest }, ref) => {
    const theme = useTheme();
    const { selectedKeys, onSelect, size, showIcon } = React.useContext(MenuContext);
    const isSelected = includes(selectedKeys, eventKey);
    const _classNames = useClassNames({ isSelected, size });
    const handleItemClick = (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      onSelect(eventKey);
      onClick(e);
    };

    const Icon = React.cloneElement(icon || <ICNoviceGuideOutlined />, {
      size: 20,
      color: isSelected
        ? theme.colors.primary
        : size === 'mini'
        ? theme.colors.icon60
        : theme.colors.icon40,
    });

    return (
      <MenuItemRoot
        ref={ref}
        isSelected={isSelected}
        theme={theme}
        onClick={handleItemClick}
        size={size}
        className={clsx(_classNames.root, className)}
        isSub={isSub}
        showIcon={showIcon}
        {...rest}
      >
        {showIcon && (
          <IconBox size={size} className={_classNames.icon}>
            {Icon}
          </IconBox>
        )}
        <span className={_classNames.text}>{children}</span>
      </MenuItemRoot>
    );
  },
);

MenuItem.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  icon: null,
  children: null,
  onClick: () => {},
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
