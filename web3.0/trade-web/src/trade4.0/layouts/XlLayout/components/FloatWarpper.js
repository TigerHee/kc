/*
 * owner: Borden@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import { isRTLLanguage } from 'src/utils/langTools';
import SvgComponent from '@/components/SvgComponent';
import TooltipWrapper from '@/components/TooltipWrapper';
import { TABSET_HEADER_HEIGHT, TABSET_RADIUS } from '../constants';

const getZIndex = ({ isPin, isFocus }) => {
  if (isPin) {
    return 29;
  } else if (isFocus) {
    return 19;
  }
  return 9;
};
// Resizable Handle ClassName
const handlerClasses = {
  wrapper: 'flexlayout__float-resizable-handle',
};

/** 样式开始 */
const StyledResizable = styled(Resizable)`
  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  position: fixed;
  z-index: ${getZIndex};
  border-radius: ${TABSET_RADIUS}px;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.divider4};
  background-color: ${props => props.theme.colors.background};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
  &:hover {
    .flexlayout__float-resizable-handle {
      opacity: 1;
    }
  }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${TABSET_HEADER_HEIGHT}px;
  border-bottom: 1px solid ${props => props.theme.colors.divider4};
  cursor: move;
`;
const Tab = styled.div`
  height: 100%;
  display: flex;
  font-size: 13px;
  padding: 0 8px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.cover4};
  border-right: 1px solid ${props => props.theme.colors.divider4};
`;
const Operation = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
`;
const Content = styled.div`
  flex: 1;
  position: relative;
`;
const Icon = styled(SvgComponent)`
  cursor: pointer;
  display: inline-flex;
  margin-left: 4px;
  fill: ${props => props.color};
  &:hover {
    fill: ${props => props.theme.colors.icon};
  }
`;
const ResizeHandle = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  bottom: 0;
  right: 0;
  opacity: 0;
  cursor: se-resize;
  &::after {
    content: "";
    right: 4px;
    bottom: 4px;
    width: 8px;
    height: 8px;
    position: absolute;
    box-sizing: border-box;
    border-right: 2px solid ${props => props.theme.colors.icon40};
    border-bottom: 2px solid ${props => props.theme.colors.icon40};
  }
`;
/** 样式结束 */

const Float = React.memo((props) => {
  const { colors } = useTheme();
  const {
    name,
    count,
    isPin,
    onClose,
    children,
    minWidth,
    minHeight,
    onInfoChange,
    onRectChange,
    initRect = {},
    ...otherProps
  } = props;
  const isRtl = isRTLLanguage();

  const defaultPosition = useMemo(() => {
    return {
      ...initRect,
      ...(isRtl
        ? { x: initRect.x + initRect.width - document.body.clientWidth }
        : null),
    };
  }, [initRect, isRtl]);

  const onPin = useCallback((e) => {
    e.stopPropagation();
    if (onInfoChange) {
      onInfoChange({ pin: true });
    }
  }, [onInfoChange]);

  const onFocus = useCallback(() => {
    if (!isPin && onInfoChange) {
      onInfoChange({ focus: true });
    }
  }, [isPin, onInfoChange]);

  const onDragEnd = useCallback((e, { x, y }) => {
    if (onRectChange) {
      onRectChange({ x, y });
    }
  }, [onRectChange]);

  const onResizeEnd = useCallback((a, b, c, diffSize) => {
    if (onRectChange) {
      onRectChange({
        width: initRect.width + diffSize.width,
        height: initRect.height + diffSize.height,
      });
    }
  }, [onRectChange]);

  return (
    <Draggable
      bounds="body"
      onStop={onDragEnd}
      defaultPosition={defaultPosition}
      handle=".flexlayout__float-drag-handler"
    >
      <Container isPin={isPin} onClick={onFocus} {...otherProps}>
        <StyledResizable
          minWidth={minWidth}
          minHeight={minHeight}
          onResizeStop={onResizeEnd}
          handlerClasses={handlerClasses}
          defaultSize={{ width: initRect.width, height: initRect.height }}
        >
          <Header className="flexlayout__float-drag-handler">
            <Tab>
              {name}
            </Tab>
            <Operation>
              {/* Pin不需要国际化 */}
              {count > 1 && (
                <TooltipWrapper title="Pin">
                  <Icon
                    type="pin"
                    onClick={onPin}
                    color={isPin ? colors.primary : colors.icon60}
                  />
                </TooltipWrapper>
              )}
              <Icon
                size={20}
                className="ml-8"
                onClick={onClose}
                type="layout-close"
                color={colors.icon60}
              />
            </Operation>
          </Header>
          <Content>{children}</Content>
          <ResizeHandle className="flexlayout__float-resizable-handle" />
        </StyledResizable>
      </Container>
    </Draggable>
  );
});

export default Float;
