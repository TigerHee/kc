/**
 * Owner: willen@kupotech.com
 */
import {
  animate,
  debounce,
  ownerDocument,
  ownerWindow,
  styled,
  useEventCallback,
  useTheme,
} from '@kufox/mui';
import { getNormalizedScrollLeft } from '@kufox/mui/utils/scrollLeft.js';
import * as React from 'react';
import ScrollbarSize from './ScrollbarSize';
import ScrollButton from './ScrollButton';

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
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
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

    return styles;
  },
);

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const ScrollTabs = React.forwardRef(function Tabs(props, ref) {
  const theme = useTheme();
  const {
    action,
    children: childrenProp,
    className,
    component = 'div',
    onChange,
    orientation = 'horizontal',
    value,
    ...other
  } = props;
  const vertical = orientation === 'vertical';

  const scrollStart = 'scrollLeft';
  const start = 'left';
  const end = 'right';
  const clientSize = 'clientWidth';
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
    component,
    orientation,
    vertical,
    fixed: !scrollable,
    hideScrollbar: scrollable,
    scrollableX: scrollable,
  };

  const tabsRef = React.useRef(null);
  const tabListRef = React.useRef(null);

  const scroll = (scrollValue, { animation = true } = {}) => {
    if (animation) {
      animate(scrollStart, tabsRef.current, scrollValue, {
        duration: theme.transitions.duration.standard,
      });
    } else {
      tabsRef.current[scrollStart] = scrollValue;
    }
  };

  const moveTabsScroll = (delta) => {
    let scrollValue = tabsRef.current[scrollStart];

    scrollValue += delta;
    scrollValue *= 1;

    scroll(scrollValue);
  };

  const getScrollSize = () => {
    const containerSize = tabsRef.current[clientSize];
    let totalSize = 0;
    const children = Array.from(tabListRef.current.children);

    for (let i = 0; i < children.length; i += 1) {
      const tab = children[i];
      totalSize += tab[clientSize];
    }
    return totalSize;
  };

  const handleStartScrollClick = () => {
    moveTabsScroll(-1 * getScrollSize());
  };

  const handleEndScrollClick = () => {
    moveTabsScroll(getScrollSize());
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

    const showScrollButtons = displayScroll.start || displayScroll.end;

    conditionalElements.scrollButtonStart = showScrollButtons ? (
      <ScrollButton
        orientation={orientation}
        direction="left"
        onClick={handleStartScrollClick}
        disabled={!displayScroll.start}
      />
    ) : null;

    conditionalElements.scrollButtonEnd = showScrollButtons ? (
      <ScrollButton
        orientation={orientation}
        direction="right"
        onClick={handleEndScrollClick}
        disabled={!displayScroll.end}
      />
    ) : null;

    return conditionalElements;
  };

  const updateScrollButtonState = useEventCallback(() => {
    const { scrollWidth, clientWidth } = tabsRef.current;
    let showStartScroll;
    let showEndScroll;

    const scrollLeft = getNormalizedScrollLeft(tabsRef.current, theme.direction);
    showStartScroll = scrollLeft > 1;
    showEndScroll = scrollLeft < scrollWidth - clientWidth - 1;

    if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
      setDisplayScroll({ start: showStartScroll, end: showEndScroll });
    }
  });

  React.useEffect(() => {
    const handleResize = debounce(() => {
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
  }, [updateScrollButtonState]);

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
    updateScrollButtonState();
  });

  React.useImperativeHandle(
    action,
    () => ({
      updateScrollButtons: updateScrollButtonState,
    }),
    [updateScrollButtonState],
  );

  let childIndex = 0;
  const children = React.Children.map(childrenProp, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const childValue = child.props.value === undefined ? childIndex : child.props.value;

    childIndex += 1;
    return React.cloneElement(child, {
      ...child.props,
      key: childValue,
    });
  });

  const handleKeyDown = (event) => {
    const list = tabListRef.current;
    const currentFocus = ownerDocument(list).activeElement;
    const role = currentFocus.getAttribute('role');
    if (role !== 'tab') {
      return;
    }

    let previousItemKey = 'ArrowLeft';
    let nextItemKey = 'ArrowRight';

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
    <TabsRoot ownerState={ownerState} ref={ref} as={component} theme={theme} {...other}>
      {conditionalElements.scrollButtonStart}
      {conditionalElements.scrollbarSizeListener}
      <TabsScroller
        ownerState={ownerState}
        style={{
          overflow: scrollerStyle.overflow,
          marginBottom: -scrollerStyle.scrollbarWidth,
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
      </TabsScroller>
      {conditionalElements.scrollButtonEnd}
    </TabsRoot>
  );
});

export default ScrollTabs;
