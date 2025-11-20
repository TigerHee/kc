import React, { useState } from 'react';
import useTheme from 'hooks/useTheme';
import { ICArrowDownOutlined } from '@kux/icons';
import { MenuContext } from 'context/index';
import clsx from 'clsx';
import { generateClassName, composeClassNames } from 'styles/index';
import { capitalize } from 'utils/index';
import Collapse from '../Collapse';
import { parseChildren, SubMenuWrapper, SubMenuTitle, SubMenuItems, TitleWrapper } from './kux';

function getDrawerClassName(slot) {
  return generateClassName('KuxMenuItem', slot);
}

function useClassNames(state) {
  const { isSelected, size } = state;
  const slots = {
    root: ['root', size && `size${capitalize(size)}`, isSelected && 'selected'],
    subWrapper: ['sub-root'],
    title: ['title', isSelected && 'selected'],
    text: ['text'],
  };
  return composeClassNames(slots, getDrawerClassName);
}

function SubMenu({
  children,
  title,
  eventKey,
  onClick,
  className,
  layer = 1,
  defaultExpand = false,
  icon,
  ...props
}) {
  const theme = useTheme();
  const { childList } = parseChildren(children, { isSub: true, layer: layer + 1 });
  const { selectedKeys, size, showIcon } = React.useContext(MenuContext);
  const isSelected = selectedKeys.some((key) => key === eventKey || key.startsWith(`${eventKey}-`));
  const _classNames = useClassNames({ isSelected, size });
  const moreChild = React.Children.count(children) > 1;
  const [isExpanded, setIsExpanded] = useState(defaultExpand);

  const handleItemClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setIsExpanded((prevState) => {
      const newState = !prevState;
      return newState;
    });

    onClick && onClick(e);
  };

  return (
    <SubMenuWrapper
      className={clsx(
        _classNames.root,
        'KuxMenuItem-root-sub',
        icon && 'KuxMenuItem-root-sub-hasIcon',
        className,
      )}
      onClick={handleItemClick}
      theme={theme}
      showIcon={showIcon}
      {...props}
    >
      <SubMenuTitle
        className={_classNames.title}
        theme={theme}
        isSelected={isSelected}
        isExpanded={isExpanded}
        layer={layer}
      >
        <TitleWrapper theme={theme}>
          {showIcon && icon}
          <span className={_classNames.text}>{title}</span>
        </TitleWrapper>
        {moreChild ? (
          <ICArrowDownOutlined size={16} color={theme.colors.text} className="KuxMenuItem-arrow" />
        ) : null}
      </SubMenuTitle>
      <Collapse in={isExpanded}>
        <SubMenuItems layer={layer} className={`KuxSubMenu-layer${layer}`} theme={theme}>
          {childList}
        </SubMenuItems>
      </Collapse>
    </SubMenuWrapper>
  );
}

SubMenu.displayName = 'SubMenu';

export default SubMenu;
