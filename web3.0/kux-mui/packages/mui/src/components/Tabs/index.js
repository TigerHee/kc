/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useCallback, useImperativeHandle, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ownerDocument, ownerWindow, animate, debounce } from 'utils/index';
import useEventCallback from 'hooks/useEventCallback';
import useTheme from 'hooks/useTheme';
import { getNormalizedScrollLeft } from 'utils/scrollLeft';
import clsx from 'clsx';
import TabScrollButton from './TabScrollButton';
import useClassNames from './useClassNames';
import {
  TabsRoot,
  TabsScroller,
  FlexContainer,
  TabsIndicator,
  IndicatorInner,
  TabsScrollbarSize,
  Slider,
} from './kux';
import Tab from '../Tab';

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

const defaultIndicatorStyle = {};

const Tabs = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const {
    action,
    bordered = false,
    children: childrenProp,
    className,
    component,
    onChange,
    value,
    variant,
    size: tabSize,
    activeType,
    type,
    indicator: showIndicator,
    centeredActive,
    enableWheel,
    direction,
    ...other
  } = props;

  const scrollStart = 'scrollLeft';
  const start = 'left';
  const end = 'right';
  const clientSize = 'clientWidth';
  const size = 'width';

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
    variant,
    fixed: !scrollable,
    hideScrollbar: scrollable,
    scrollableX: true,
  };
  const _classNames = useClassNames({ ...ownerState });

  const valueToIndex = new Map();
  const tabsRef = React.useRef(null);
  const tabListRef = React.useRef(null);
  const sliderRef = React.useRef(null);

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
    const startIndicator = 'left';

    if (tabMeta && tabsMeta) {
      const correction = tabsMeta.scrollLeft;
      startValue = tabMeta[startIndicator] - tabsMeta[startIndicator] + correction;
    }

    const newIndicatorStyle = {
      [startIndicator]: startValue,
      [size]: tabMeta ? tabMeta[size] : 0,
      transition: 'all .3s ease 0.2s',
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
      if (totalSize + tab[clientSize] > containerSize) {
        break;
      }
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

  const handleScrollbarSizeChange = useCallback((scrollbarWidth) => {
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

    conditionalElements.scrollButtonStart = displayScroll.start ? (
      <TabScrollButton
        direction="left"
        onClick={handleStartScrollClick}
        disabled={!displayScroll.start}
        className={_classNames.scrollButtonLeft}
        size={tabSize}
        variant={variant}
        type={type}
      />
    ) : null;

    conditionalElements.scrollButtonEnd = displayScroll.end ? (
      <TabScrollButton
        direction="right"
        onClick={handleEndScrollClick}
        disabled={!displayScroll.end}
        className={_classNames.scrollButtonRight}
        size={tabSize}
        variant={variant}
        type={type}
      />
    ) : null;

    return conditionalElements;
  };

  const scrollSelectedIntoView = useEventCallback((animation) => {
    const { tabsMeta, tabMeta } = getTabsMeta();

    if (!tabMeta || !tabsMeta) {
      return;
    }
    const halfTabMetaClientWidth = tabMeta.width / 2;
    const halfTabsMetaClientWidth = tabsMeta.clientWidth / 2;

    if (centeredActive) {
      const nextScrollStart =
        tabsMeta[start] + halfTabsMetaClientWidth - (halfTabMetaClientWidth + tabMeta[start]);
      scroll(tabsMeta[scrollStart] - nextScrollStart, { animation });
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
    if (!tabsRef || !tabsRef.current) return;
    const { scrollWidth, clientWidth } = tabsRef.current;
    const scrollLeft = getNormalizedScrollLeft(tabsRef.current, direction);

    const showStartScroll = scrollLeft > 1;
    const showEndScroll = scrollLeft < scrollWidth - clientWidth - 1;

    if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
      setDisplayScroll({ start: showStartScroll, end: showEndScroll });
    }
  });

  useEffect(() => {
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

  const handleTabsScroll = useMemo(
    () =>
      debounce(() => {
        updateScrollButtonState();
      }),
    [updateScrollButtonState],
  );

  useEffect(() => {
    return () => {
      handleTabsScroll.clear();
    };
  }, [handleTabsScroll]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWheel = (e) => {
    if (!e || !e.deltaY) return;
    if (Math.abs(e.deltaX) > 0) return;
    const _scrollLeft = tabsRef.current.scrollLeft;
    tabsRef.current.scrollLeft = _scrollLeft + -e.deltaY;
  };

  useEffect(() => {
    if (!enableWheel) return;
    tabsRef.current.addEventListener('wheel', handleWheel);
    return () => {
      tabsRef.current.removeEventListener('wheel', handleWheel);
    };
  }, [enableWheel]);

  useEffect(() => {
    updateSliderBackground(false);
  }, [updateSliderBackground]);

  const updateSliderBackground = useCallback(
    (animate = true) => {
      if (variant !== 'slider' || !sliderRef || !sliderRef.current) return;
      const { tabMeta, tabsMeta } = getTabsMeta();

      sliderRef.current.style.left = `${tabMeta.left - tabsMeta.left}px`;
      sliderRef.current.style.width = `${tabMeta.width}px`;
      if (animate) {
        sliderRef.current.style.transition = 'left 0.3s, width 0.3s';
      }
    },
    [getTabsMeta, variant],
  );

  useEffect(() => {
    updateIndicatorState();
    updateScrollButtonState();
    updateSliderBackground();
  });

  useEffect(() => {
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
  }, [scrollSelectedIntoView, indicatorStyle]);

  useImperativeHandle(
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
      className={_classNames.indicator}
      size={tabSize}
      style={{
        ...indicatorStyle,
      }}
    >
      <IndicatorInner theme={theme} size={tabSize} />
    </TabsIndicator>
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
      indicator: showIndicator && selected && !mounted && variant === 'line' && indicator,
      selected,
      variant,
      onChange,
      value: childValue,
      size: tabSize,
      activeType,
      type,
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

    const previousItemKey = 'ArrowLeft';
    const nextItemKey = 'ArrowRight';

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
      variant={variant}
      bordered={bordered}
      className={clsx(_classNames.container, className)}
      ref={ref}
      as={component}
      theme={theme}
      tabSize={tabSize}
      type={type}
      {...other}
    >
      {conditionalElements.scrollButtonStart}
      {conditionalElements.scrollbarSizeListener}
      {variant === 'slider' && <Slider size={tabSize} theme={theme} ref={sliderRef} />}
      <TabsScroller
        className={_classNames.scroller}
        ownerState={ownerState}
        style={{
          overflow: scrollerStyle.overflow,
          marginBottom: -scrollerStyle.scrollbarWidth,
        }}
        ref={tabsRef}
        onScroll={handleTabsScroll}
        id="_TabsScroller_"
      >
        <FlexContainer
          className={_classNames.Container}
          ownerState={ownerState}
          onKeyDown={handleKeyDown}
          size={tabSize}
          ref={tabListRef}
          variant={variant}
          role="tablist"
        >
          {children}
        </FlexContainer>
        {mounted && variant === 'line' && showIndicator && indicator}
      </TabsScroller>
      {conditionalElements.scrollButtonEnd}
    </TabsRoot>
  );
});

Tabs.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(['line', 'bordered', 'slider']), // slider use for app
  bordered: PropTypes.bool,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
  activeType: PropTypes.oneOf(['default', 'primary']),
  type: PropTypes.oneOf(['default', 'text', 'normal']), // normal use for app
  indicator: PropTypes.bool, // set the indicator of line tabs
  centeredActive: PropTypes.bool, // set active tab to center
  enableWheel: PropTypes.bool, // wtf!! it seems very slow, be careful in use!!
  direction: PropTypes.oneOf(['ltr', 'rtl']),
};

Tabs.defaultProps = {
  component: 'div',
  variant: 'line',
  size: 'large',
  bordered: false,
  activeType: 'default',
  type: 'default',
  indicator: true,
  centeredActive: false,
  enableWheel: false,
  direction: 'ltr',
};

Tabs.Tab = Tab;

export default Tabs;
