/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MenuContext } from 'context/index';
import useTheme from 'hooks/useTheme';
import clsx from 'clsx';
import { parseChildren, MenuContent } from './kux';
import useClassNames from './useClassNames';
import MenuItem from '../MenuItem';
import SubMenu from './SubMenu';
import SearchInput from './SearchInput';

const Menu = React.forwardRef(
  (
    {
      selectedKeys,
      defaultSelectedKeys,
      children,
      onSelect,
      size,
      className,
      showIcon,
      search,
      searchOptions,
      searchProps,
      onSearch,
      defaultMenuText: _defaultMenuText,
      ...rest
    },
    ref,
  ) => {
    const _classNames = useClassNames();
    const theme = useTheme();
    const { childList } = parseChildren(children);
    const [mergedSelectKeys, setSelectedKeys] = useState(defaultSelectedKeys);

    useEffect(() => {
      if (selectedKeys) {
        setSelectedKeys(selectedKeys);
      }
    }, [selectedKeys]);

    const triggerSelectKeysChange = React.useCallback(
      (targetKey) => {
        const newSelectKeys = [targetKey];
        setSelectedKeys(newSelectKeys);
        onSelect(newSelectKeys);
      },
      [onSelect, setSelectedKeys],
    );

    const contextValue = React.useMemo(() => {
      return {
        selectedKeys: mergedSelectKeys,
        onSelect: triggerSelectKeysChange,
        size,
        showIcon,
      };
    }, [mergedSelectKeys, triggerSelectKeysChange, size, showIcon]);

    return (
      <MenuContext.Provider value={contextValue}>
        <MenuContent
          className={clsx(_classNames.root, className)}
          ref={ref}
          theme={theme}
          size={size}
          {...rest}
        >
          {search && <SearchInput options={searchOptions} onChange={onSearch} {...searchProps} />}
          {childList}
        </MenuContent>
      </MenuContext.Provider>
    );
  },
);

Menu.displayName = 'Menu';

Menu.propTypes = {
  selectedKeys: PropTypes.array,
  defaultSelectedKeys: PropTypes.array,
  size: PropTypes.oneOf(['mini', 'basic']),
  onSelect: PropTypes.func,
  showIcon: PropTypes.bool,
  search: PropTypes.bool,
  searchOptions: PropTypes.array,
  searchProps: PropTypes.object,
  onSearch: PropTypes.func,
  defaultMenuText: PropTypes.node,
};

Menu.defaultProps = {
  defaultSelectedKeys: [],
  size: 'basic',
  onSelect: () => {},
  showIcon: true,
  search: false,
  searchOptions: [],
  onSearch: () => {},
  searchProps: {},
  defaultMenuText: 'Menu',
};

Menu.MenuItem = MenuItem;
Menu.SubMenu = SubMenu;

export default Menu;
