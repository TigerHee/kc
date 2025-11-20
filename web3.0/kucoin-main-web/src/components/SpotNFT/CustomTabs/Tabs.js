/**
 * Owner: willen@kupotech.com
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { refType, ownerDocument, ownerWindow, animate, debounce } from '@kufox/mui';
import { getNormalizedScrollLeft } from '@kufox/mui/utils/scrollLeft.js';
import { styled } from '@kufox/mui';
import { useTheme, useEventCallback } from '@kufox/mui';
import ScrollbarSize from './ScrollbarSize';
const nextItem = (list, item) => {
  if (list === item) {
    return list.firstChild;
  }
  if (item && item.nextElementSibling) {
    return item.nextElementSibling;
  }
  return list.firstChild;
};

const previousItem = (list, item) => {
  if (list === item) {
    return list.lastChild;
  }
  if (item && item.previousElementSibling) {
    return item.previousElementSibling;
  }
  return list.lastChild;
};

const moveFocus = (list, currentFocus, traversalFunction) => {
  let wrappedOnce = false;
  let nextFocus = traversalFunction(list, currentFocus);

  while (nextFocus) {
    if (nextFocus === list.firstChild) {
      if (wrappedOnce) {
        return;
      }
      wrappedOnce = true;
    }

    const nextFocusDisabled =
      nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true';
    if (!nextFocus.hasAttribute('tabindex') || nextFocusDisabled) {
      nextFocus = traversalFunction(list, nextFocus);
    } else {
      nextFocus.focus();
      return;
    }
  }
};

const TabsRoot = styled.div`
  overflow: hidden;
  height: 40px;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
  border-bottom: ${({ ownerState, theme }) =>
    ownerState.variant === 'line' && ownerState.bordered
      ? `1px solid ${theme.colors.divider}`
      : 'none'};
`;

const TabsScroller = styled.div(
  {
    position: 'relative',
    display: 'inline-block',
    flex: '1 1 auto',
    whiteSpace: 'nowrap',
  },
  ({ ownerState }) => {
    let styles = {};
    if (ownerState.fixed) {
      styles = {
        overflowX: 'hidden',
        width: '100%',
        ...styles,
      };
    }
    if (ownerState.hideScrollbar) {
      styles = {
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Safari + Chrome
        },
        ...styles,
      };
    }
    if (ownerState.scrollableX) {
      styles = {
        overflowX: 'auto',
        overflowY: 'hidden',
        ...styles,
      };
    }
    if (ownerState.scrollableY) {
      styles = {
        overflowY: 'auto',
        overflowX: 'hidden',
        ...styles,
      };
    }

    return styles;
  },
);

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
`;

const TabsIndicator = styled.span`
  position: absolute;
  height: ${(props) => (props.vertical ? '100%' : '4px')};
  bottom: 0;
  border-radius: 2px;
  width: ${(props) => (props.vertical ? '2px' : '100%')};
  background: ${(props) => props.theme.colors.primary};
  transition: ${(props) => props.theme.transitions.create()};
`;

const TabsScrollbarSize = styled(ScrollbarSize, {
  name: 'MuiTabs',
  slot: 'ScrollbarSize',
})({
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const defaultIndicatorStyle = {};

const Tabs = React.forwardRef(function Tabs(props, ref) {
  const theme = useTheme();
  const {
    action,
    bordered = true,
    children: childrenProp,
    className,
    component = 'div',
    onChange,
    orientation = 'horizontal',
    value,
    variant = 'line',
    indicatorFull = true,
    ...other
  } = props;
  const vertical = orientation === 'vertical';

  const scrollStart = vertical ? 'scrollTop' : 'scrollLeft';
  const start = vertical ? 'top' : 'left';
  const end = vertical ? 'bottom' : 'right';
  const clientSize = vertical ? 'clientHeight' : 'clientWidth';
  const size = vertical ? 'height' : 'width';

  const [mounted, setMounted] = React.useState(false);
  const [indicatorStyle, setIndicatorStyle] = React.useState(defaultIndicatorStyle);
  const [displayScroll, setDisplayScroll] = React.useState({
    start: false,
    end: false,
  });

  const [scrollerStyle, setScrollerStyle] = React.useState({
    overflow: 'hidden',
    scrollbarWidth: 0,
  });

  const scrollable = displayScroll.start || displayScroll.end;

  const ownerState = {
    ...props,
    bordered,
    component,
    orientation,
    vertical,
    variant,
    fixed: !scrollable,
    hideScrollbar: scrollable,
    scrollableX: scrollable && !vertical,
    scrollableY: scrollable && vertical,
  };

  const valueToIndex = new Map();
  const tabsRef = React.useRef(null);
  const tabListRef = React.useRef(null);

  const getTabsMeta = () => {
    const tabsNode = tabsRef.current;
    let tabsMeta;
    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect();
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, theme.direction),
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      };
    }

    let tabMeta;
    if (tabsNode && value !== false) {
      const { children } = tabListRef.current;

      if (children.length > 0) {
        const tab = children[valueToIndex.get(value)];
        tabMeta = tab ? tab.getBoundingClientRect() : null;
      }
    }
    return { tabsMeta, tabMeta };
  };

  const updateIndicatorState = useEventCallback(() => {
    const { tabsMeta, tabMeta } = getTabsMeta();
    let startValue = 0;
    let startIndicator;

    if (vertical) {
      startIndicator = 'top';
      if (tabMeta && tabsMeta) {
        startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop;
      }
    } else {
      startIndicator = 'left';
      if (tabMeta && tabsMeta) {
        const correction = tabsMeta.scrollLeft;
        if (size === 'width' && !indicatorFull) {
          const _width = tabMeta[size];
          tabMeta[size] = 24;
          startValue =
            tabMeta[startIndicator] - tabsMeta[startIndicator] + correction + (_width - 24) / 2;
        } else {
          startValue = tabMeta[startIndicator] - tabsMeta[startIndicator] + correction;
        }
      }
    }

    const newIndicatorStyle = {
      [startIndicator]: startValue,
      [size]: tabMeta ? tabMeta[size] : 0,
    };

    if (isNaN(indicatorStyle[startIndicator]) || isNaN(indicatorStyle[size])) {
      setIndicatorStyle(newIndicatorStyle);
    } else {
      const dStart = Math.abs(indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator]);
      const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size]);

      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle);
      }
    }
  });

  const scroll = (scrollValue, { animation = true } = {}) => {
    if (animation) {
      animate(scrollStart, tabsRef.current, scrollValue, {
        duration: theme.transitions.duration.standard,
      });
    } else {
      tabsRef.current[scrollStart] = scrollValue;
    }
  };
  const handleScrollbarSizeChange = React.useCallback((scrollbarWidth) => {
    setScrollerStyle({
      overflow: null,
      scrollbarWidth,
    });
  }, []);

  const getConditionalElements = () => {
    const conditionalElements = {};

    conditionalElements.scrollbarSizeListener = scrollable ? (
      <TabsScrollbarSize onChange={handleScrollbarSizeChange} />
    ) : null;

    return conditionalElements;
  };

  const scrollSelectedIntoView = useEventCallback((animation) => {
    const { tabsMeta, tabMeta } = getTabsMeta();

    if (!tabMeta || !tabsMeta) {
      return;
    }

    if (tabMeta[start] < tabsMeta[start]) {
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start]);
      scroll(nextScrollStart, { animation });
    } else if (tabMeta[end] > tabsMeta[end]) {
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end]);
      scroll(nextScrollStart, { animation });
    }
  });

  const updateScrollButtonState = useEventCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollWidth, clientWidth } = tabsRef.current;
    let showStartScroll;
    let showEndScroll;

    if (vertical) {
      showStartScroll = scrollTop > 1;
      showEndScroll = scrollTop < scrollHeight - clientHeight - 1;
    } else {
      const scrollLeft = getNormalizedScrollLeft(tabsRef.current, theme.direction);
      showStartScroll = scrollLeft > 1;
      showEndScroll = scrollLeft < scrollWidth - clientWidth - 1;
    }

    if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
      setDisplayScroll({ start: showStartScroll, end: showEndScroll });
    }
  });

  React.useEffect(() => {
    const handleResize = debounce(() => {
      updateIndicatorState();
      updateScrollButtonState();
    });
    const win = ownerWindow(tabsRef.current);
    win.addEventListener('resize', handleResize);

    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      Array.from(tabListRef.current.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }

    return () => {
      handleResize.clear();
      win.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateIndicatorState, updateScrollButtonState]);

  const handleTabsScroll = React.useMemo(
    () =>
      debounce(() => {
        updateScrollButtonState();
      }),
    [updateScrollButtonState],
  );

  React.useEffect(() => {
    return () => {
      handleTabsScroll.clear();
    };
  }, [handleTabsScroll]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    updateIndicatorState();
    // updateScrollButtonState();
  });

  React.useEffect(() => {
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
  }, [scrollSelectedIntoView, indicatorStyle]);

  React.useImperativeHandle(
    action,
    () => ({
      updateIndicator: updateIndicatorState,
      updateScrollButtons: updateScrollButtonState,
    }),
    [updateIndicatorState, updateScrollButtonState],
  );

  const indicator = (
    <TabsIndicator
      theme={theme}
      ownerState={ownerState}
      style={{
        ...indicatorStyle,
      }}
    />
  );

  let childIndex = 0;
  const children = React.Children.map(childrenProp, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const childValue = child.props.value === undefined ? childIndex : child.props.value;
    valueToIndex.set(childValue, childIndex);
    const selected = childValue === value;

    childIndex += 1;
    return React.cloneElement(child, {
      indicator: selected && !mounted && variant === 'line' && indicator,
      selected,
      variant,
      onChange,
      value: childValue,
      ...(childIndex === 1 && value === false && !child.props.tabIndex ? { tabIndex: 0 } : {}),
    });
  });

  const handleKeyDown = (event) => {
    const list = tabListRef.current;
    const currentFocus = ownerDocument(list).activeElement;
    const role = currentFocus.getAttribute('role');
    if (role !== 'tab') {
      return;
    }

    const previousItemKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextItemKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

    switch (event.key) {
      case previousItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, previousItem);
        break;
      case nextItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, nextItem);
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(list, null, nextItem);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(list, null, previousItem);
        break;
      default:
        break;
    }
  };

  const conditionalElements = getConditionalElements();

  return (
    <TabsRoot
      ownerState={ownerState}
      className={className}
      ref={ref}
      as={component}
      theme={theme}
      {...other}
    >
      {conditionalElements.scrollbarSizeListener}
      <TabsScroller
        ownerState={ownerState}
        style={{
          overflow: scrollerStyle.overflow,
          [vertical ? `marginRight` : 'marginBottom']: -scrollerStyle.scrollbarWidth,
        }}
        ref={tabsRef}
        onScroll={handleTabsScroll}
      >
        <FlexContainer
          ownerState={ownerState}
          onKeyDown={handleKeyDown}
          ref={tabListRef}
          role="tablist"
        >
          {children}
        </FlexContainer>
        {mounted && variant === 'line' && indicator}
      </TabsScroller>
    </TabsRoot>
  );
});

Tabs.propTypes = {
  action: refType,
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  onChange: PropTypes.func,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  value: PropTypes.any,
  variant: PropTypes.oneOf(['line', 'card', 'bordered']),
  bordered: PropTypes.bool,
};

Tabs.defaultProps = {
  component: 'div',
  variant: 'line',
  orientation: 'horizontal',
};

export default Tabs;
