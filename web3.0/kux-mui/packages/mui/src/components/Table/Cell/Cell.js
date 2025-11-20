/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import showEqual from 'utils/showEqual';
import useTheme from 'hooks/useTheme';
import { variant } from 'styled-system';
import { fade, blendColors } from 'utils/colorManipulator';
import { getPathValue, isRenderCell, validateValue, inHoverRange } from '../aux';
import { TableStickyContext, TableRowHoverContext, TableContext } from '../cts/cts';

const CellRoot = styled.td((props) => {
  let styles = {
    boxSizing: 'border-box',
    display: 'table-cell',
  };
  if (props.ellipsis) {
    styles = {
      ...styles,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      wordBreak: 'keep-all',
    };
  }
  if (props.lastFixLeft && props.pingedLeft) {
    styles = {
      ...styles,
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: '-1px',
        width: '30px',
        transform: 'translateX(100%)',
        boxShadow: `inset 6px 0 8px -8px ${props.theme.colors.text30}`,
        pointerEvents: 'none',
      },
    };
  }
  if (props.firstFixRight && props.pingedRight) {
    styles = {
      ...styles,
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: '-1px',
        width: '30px',
        transform: 'translateX(-100%)',
        boxShadow: `inset -6px 0 8px -8px ${props.theme.colors.text30}`,
        pointerEvents: 'none',
      },
    };
  }
  return styles;
});

const StyledCellRoot = styled(CellRoot)`
  position: relative;
  font-size: 16px;
  line-height: 130%;
  font-weight: 500;
  border-right: transparent;
  border-left: transparent;
  border-bottom: 1px solid
    ${(props) => (props.isEmpty || !props.bordered ? 'transparent' : props.theme.colors.cover4)};
  color: ${(props) => props.theme.colors.text};
  ${variant({
    prop: 'size',
    variants: {
      small: {
        padding: '21.5px 0',
      },
      basic: {
        padding: '29.5px 0',
      },
    },
  })}
  background: ${(props) => (props.hovering ? props.theme.colors.cover2 : 'transparent')};
  &:first-of-type {
    padding-left: ${(props) => (props.scroll ? '16px' : 0)};
  }
  &:last-of-type {
    padding-right: ${(props) => (props.scroll ? '16px' : 0)};
  }
  ${(props) =>
    !props.scroll &&
    `
      &:first-of-type {
        &:before{
          content: ' ';
          position: absolute;
          height: 100%;
          left: -16px;
          top: 0;
          width: 16px;
          border-radius: 12px 0 0 12px;
          background: ${props.hovering ? props.theme.colors.cover2 : 'transparent'};
        }
      }
      &:last-of-type {
        &:after{
          content: ' ';
          position: absolute;
          height: 100%;
          right: -16px;
          top: 0;
          width: 16px;
          border-radius: 0 12px 12px 0;
          background: ${props.hovering ? props.theme.colors.cover2 : 'transparent'};
        }
      }
  `}
`;

const StyledHeaderCellRoot = styled(CellRoot)`
  position: relative;
  font-size: 14px;
  line-height: 130%;
  font-weight: 400;
  border-right: transparent;
  border-left: transparent;
  border-top: transparent;
  color: ${(props) => props.theme.colors.text30};
  padding: 10px 0 12px 0;
  ${(props) =>
    props.headerBorder && {
      borderBottom: `1px solid ${props.theme.colors.cover4}`,
    }}
  ${({ headerType, theme }) => {
    return variant({
      prop: 'headerType',
      variants: {
        transparent: {
          background: theme.colors.overlay,
        },
        filled: {
          background: blendColors(theme.colors.overlay, fade(theme.colors.text, 0.02)),
        },
      },
    })({ headerType });
  }}
  &:first-of-type {
    padding-left: ${(props) => (props.scroll ? '16px' : 0)};
  }
  &:last-of-type {
    padding-right: ${(props) => (props.scroll ? '16px' : 0)};
  }
  ${(props) => {
    return (
      !props.scroll &&
      `
      &:first-of-type {
        &:before{
          content: ' ';
          position: absolute;
          height: 100%;
          left: -16px;
          top: 0;
          width: 16px;
          border-radius: 12px 0 0 12px;
          background: ${props.headerType === 'filled' ? props.theme.colors.cover2 : 'transparent'};
        }
      }
      &:last-of-type {
        &:after{
          content: ' ';
          position: absolute;
          height: 100%;
          right: -16px;
          top: 0;
          width: 16px;
          border-radius: 0 12px 12px 0;
          background: ${props.headerType === 'filled' ? props.theme.colors.cover2 : 'transparent'};
        }
      }
  `
    );
  }}
`;

const Cell = React.forwardRef(
  (
    {
      ellipsis,
      align = 'left',
      size,
      children,
      render,
      dataIndex,
      renderIndex,
      record,
      appendNode,
      colSpan,
      rowSpan,
      fixLeft,
      fixRight,
      firstFixRight,
      lastFixLeft,
      index,
      component: Component,
      hovering,
      onHover,
      pingedLeft,
      pingedRight,
      className,
      isEmpty,
      rowType,
      bordered,
      additionalProps,
      headerBorder,
      headerType,
      scroll = {},
      direction,
    },
    ref,
  ) => {
    const theme = useTheme();

    const supportSticky = React.useContext(TableStickyContext);
    const childNode = React.useMemo(() => {
      if (rowType === 'header') {
        return children;
      }
      if (validateValue(children)) {
        return [children];
      }
      const value = getPathValue(record, dataIndex);
      let returnChildNode = value;
      if (render) {
        const readerData = render(value, record, renderIndex);
        if (isRenderCell(readerData)) {
          returnChildNode = readerData.children;
        } else {
          returnChildNode = readerData;
        }
      }
      return returnChildNode;
    }, [children, dataIndex, record, render, renderIndex, rowType]);

    let mergedChildNode = childNode;
    if (
      typeof mergedChildNode === 'object' &&
      !Array.isArray(mergedChildNode) &&
      !React.isValidElement(mergedChildNode)
    ) {
      mergedChildNode = null;
    }
    const mergedColSpan = colSpan !== undefined ? colSpan : 1;
    const mergedRowSpan = rowSpan !== undefined ? rowSpan : 1;

    if (mergedColSpan === 0 || mergedRowSpan === 0) {
      return null;
    }

    // ====================== Align =======================
    const rtlAlignMap = {
      left: 'right',
      right: 'left',
    };
    const alignStyle = {};
    if (align) {
      alignStyle.textAlign = direction === 'rtl' ? rtlAlignMap[align] || align : align;
    }

    // ====================== Fixed =======================
    let fixedStyle = {};
    const isFixLeft = typeof fixLeft === 'number' && supportSticky;
    const isFixRight = typeof fixRight === 'number' && supportSticky;
    const commonFixedStyle = {
      position: 'sticky',
      background: hovering
        ? blendColors(theme.colors.overlay, fade(theme.colors.text, 0.02))
        : Component === 'td'
        ? theme.colors.overlay
        : headerType === 'filled'
        ? blendColors(theme.colors.overlay, fade(theme.colors.text, 0.02))
        : theme.colors.overlay,
      zIndex: 2,
    };
    if (isFixLeft) {
      fixedStyle = {
        ...commonFixedStyle,
        left: fixLeft,
      };
    }
    if (isFixRight) {
      fixedStyle = {
        ...commonFixedStyle,
        right: fixRight,
      };
    }

    // ====================== Hover =======================
    const onMouseEnter = (event) => {
      if (record) {
        onHover(index, index + mergedRowSpan - 1);
      }
      if (additionalProps && additionalProps.onMouseEnter) {
        additionalProps?.onMouseEnter(event);
      }
    };

    const onMouseLeave = (event) => {
      if (record) {
        onHover(-1, -1);
      }
      if (additionalProps && additionalProps.onMouseLeave) {
        additionalProps?.onMouseLeave(event);
      }
    };

    // ====================== render =======================

    const FinalCell = Component === 'td' ? StyledCellRoot : StyledHeaderCellRoot;
    return (
      <FinalCell
        bordered={bordered}
        isEmpty={isEmpty}
        as={Component}
        colSpan={mergedColSpan}
        ref={ref}
        ellipsis={ellipsis}
        size={size}
        theme={theme}
        hovering={hovering}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        firstFixRight={firstFixRight}
        lastFixLeft={lastFixLeft}
        pingedLeft={pingedLeft}
        pingedRight={pingedRight}
        className={className}
        style={{ ...fixedStyle, ...alignStyle }}
        headerBorder={!bordered ? false : headerBorder}
        headerType={headerType}
        scroll={!!(scroll.x || scroll.y)}
        {...additionalProps}
      >
        {appendNode}
        {mergedChildNode}
      </FinalCell>
    );
  },
);

const MemoCell = React.memo(Cell, (prev, next) => {
  return showEqual(prev, next);
});

const WrappedCell = React.forwardRef((props, ref) => {
  const { onHover, startRow, endRow } = React.useContext(TableRowHoverContext);
  const { pingedRight, pingedLeft, bordered, direction } = React.useContext(TableContext);
  const { index, colSpan = 1, rowSpan = 1 } = props;
  const hovering = inHoverRange(index, rowSpan || 1, startRow, endRow);
  return (
    <MemoCell
      {...props}
      bordered={bordered}
      pingedRight={pingedRight}
      pingedLeft={pingedLeft}
      colSpan={colSpan}
      rowSpan={rowSpan}
      hovering={hovering}
      ref={ref}
      onHover={onHover}
      direction={direction}
    />
  );
});

export default WrappedCell;
