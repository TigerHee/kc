/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'clsx';
import showEqual from 'utils/showEqual';
import styled, { isPropValid } from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { ICTriangleBottomOutlined, ICTradeAddOutlined, ICTradeMinusOutlined } from '@kux/icons';
import { composeClassNames } from 'styles/index';
import useDynamicID from 'hooks/useDynamicID';
import getAccordionClassName from './classNames';
import Collapse from '../Collapse';
import Divider from '../Divider';

const iconSize = {
  default: 32,
  small: 24,
};

const AccordionPanelRoot = styled('div', {
  shouldForwardProp: (prop) => {
    return isPropValid(prop);
  },
})((props) => {
  return {
    position: 'relative',
    ...(props.dispersion && {
      background: props.theme.colors.cover2,
      marginBottom: '24px',
      padding: '32px 40px',
      borderRadius: '16px',
      '&:last-of-type': {
        marginBottom: '0px',
      },
      ...(props.size === 'small' && {
        padding: '16px',
      }),
    }),
  };
});

const AccordionPanelHeader = styled('button', {
  shouldForwardProp: (prop) => {
    return isPropValid(prop);
  },
})((props) => {
  return {
    fontFamily: `${props.theme.fonts.family}`,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '18px',
    width: '100%',
    paddingBlock: '0px',
    paddingInline: '0px',
    borderWidth: '0px',
    border: 'none',
    backgroundColor: 'transparent',
    color: `${props.theme.colors.text}`,
    cursor: 'pointer',
    padding: '20px 0 22px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...(props.bordered && {
      borderBottom: `1px solid ${props.theme.colors.cover4}`,
    }),
    ...(props.dispersion && {
      fontSize: '24px',
      padding: '0px',
      borderBottom: `none`,
      ...(props.size === 'small' && {
        fontSize: '16px',
      }),
    }),
  };
});

const StyledIcon = styled(ICTriangleBottomOutlined, {
  shouldForwardProp: (prop) => {
    return isPropValid(prop);
  },
})((props) => {
  return {
    transition: 'all 0.3s',
    transform: `rotate(${props.isActive ? '-180deg' : '0deg'})`,
  };
});

const IconWrapper = styled.span`
  margin-left: 8px;
  color: ${(props) => props.theme.colors.icon};
`;

const ContentDivider = styled(Divider)((props) => ({
  margin: '24px 0',
  background: props.theme.colors.cover4,
  ...(props.size === 'small' && {
    margin: '16px 0',
  }),
}));

const AccordionPanelContent = styled('div', {
  shouldForwardProp: (prop) => {
    return isPropValid(prop);
  },
})((props) => ({
  padding: '35px 0',
  fontSize: '14px',
  lineHeight: '20px',
  color: props.theme.colors.text60,
  ...(props.dispersion && {
    padding: '0',
    fontSize: '18px',
    lineHeight: '150%',
    color: props.theme.colors.text40,
    ...(props.size === 'small' && {
      fontSize: '16px',
    }),
  }),
}));

const AccordionActiveBg = styled.div`
  position: absolute;
  width: calc(100% + 80px);
  height: 100%;
  left: -40px;
  top: 0;
  border-radius: 16px;
  background: ${(props) => props.theme.colors.cover2};
  transition: background 0.3s ease;
  pointer-events: none;
`;

const useClassNames = (state) => {
  const { classNames: classNamesFromState, isActive, bordered } = state;
  const slots = {
    root: ['root', isActive && 'active', bordered && 'bordered'],
    head: ['head', isActive && 'active'],
    panel: ['panel', isActive && 'active'],
    icon: ['iconWrapper', isActive && 'active'],
    activeBg: ['activeBg'],
  };
  return composeClassNames(slots, getAccordionClassName, classNamesFromState);
};

const AccordionPanel = React.forwardRef(
  (
    {
      onItemClick,
      panelKey,
      isActive,
      children,
      expandIcon,
      bordered = true,
      header,
      className,
      headerClassName,
      panelContentClassName,
      dispersion,
      size,
      ...others
    },
    ref,
  ) => {
    const theme = useTheme();
    const controlsId = useDynamicID();
    const accordionId = useDynamicID();

    const ownerState = {
      ...others,
      bordered,
      isActive,
    };
    const _classNames = useClassNames(ownerState);

    const handleItemClick = () => {
      onItemClick?.(panelKey);
    };
    return (
      <AccordionPanelRoot
        theme={theme}
        ref={ref}
        dispersion={dispersion}
        size={size}
        className={classNames(_classNames.root, className)}
      >
        <AccordionPanelHeader
          onClick={handleItemClick}
          theme={theme}
          className={classNames(_classNames.head, headerClassName)}
          bordered={bordered}
          dispersion={dispersion}
          size={size}
          aria-expanded={isActive}
          aria-controls={controlsId}
          id={accordionId}
        >
          {header}
          <IconWrapper theme={theme} className={_classNames.icon}>
            {expandIcon ? (
              expandIcon(isActive)
            ) : dispersion ? (
              isActive ? (
                <ICTradeMinusOutlined size={iconSize[size]} color={theme.colors.text} />
              ) : (
                <ICTradeAddOutlined size={iconSize[size]} color={theme.colors.text} />
              )
            ) : (
              <StyledIcon size="16" color={theme.colors.icon60} isActive={isActive} />
            )}
          </IconWrapper>
        </AccordionPanelHeader>
        <Collapse in={isActive} id={controlsId} role="region" aria-labelledby={accordionId}>
          {dispersion && <ContentDivider theme={theme} size={size} />}
          <AccordionPanelContent
            theme={theme}
            dispersion={dispersion}
            size={size}
            className={classNames(_classNames.panel, panelContentClassName)}
          >
            {children}
          </AccordionPanelContent>
        </Collapse>
        {!dispersion && isActive && (
          <AccordionActiveBg theme={theme} className={_classNames.activeBg} />
        )}
      </AccordionPanelRoot>
    );
  },
);

AccordionPanel.displayName = 'AccordionPanel';

AccordionPanel.propTypes = {
  header: PropTypes.node,
};

const MemoAccordionPanel = React.memo(AccordionPanel, (prevProps, nextProps) => {
  return showEqual(prevProps, nextProps);
});

export default MemoAccordionPanel;
