/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Tabs component
 */

import { useCallback, useEffect, useMemo, useRef, useState, RefObject } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@kux/iconpack';
import { clx } from '@/common';
import { useDebounceFn, useDir } from '@/hooks';
import { animate, getNormalizedScrollLeft } from './utils';

import './style.scss';

export type TTabs = 'line' | 'bordered' | 'slider';
export type TSize = 'small' | 'medium' | 'large';
export type TabType = 'default' | 'text' | 'normal';

export type ITabValue = string | number;

export interface ITabsProps<V extends ITabValue = number> {
  tabs: Array<{ label: string; value: V }>;
  value: V;
  onChange: (value: V) => void;
  /**
   * 类型
   */
  variant: TTabs;
  /**
   * 尺寸
   */
  size?: TSize;
  /**
   * 类型为 line 时是否显示下划线
   */
  showUnderline?: boolean;
  /**
   * 是否显示滚动按钮
   */
  showScrollButtons?: boolean;
  /** slider时是否占满容器宽度 */
  sliderBlock?: boolean;
  bordered?: boolean;
  className?: string;
}

const defaultIndicatorStyle = {
  left: 0,
  width: 0,
};

interface ITabsMeta {
  clientWidth: number;
  scrollLeft: number;
  scrollTop: number;
  scrollLeftNormalized: number;
  scrollWidth: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function Tabs<V extends ITabValue = number>(props: ITabsProps<V>) {
  const {
    className,
    onChange,
    value,
    variant = 'line',
    size = 'medium',
    showUnderline = true,
    tabs,
    sliderBlock = false,
  } = props;
  const direction = useDir();
  const scrollStart = 'scrollLeft';
  const clientSize = 'clientWidth';
  const [indicatorStyle, setIndicatorStyle] = useState(defaultIndicatorStyle);
  const [displayScroll, setDisplayScroll] = useState({
    start: false,
    end: false,
  });

  const valueToIndex = useMemo(() => new Map(), []);
  const tabsRef: RefObject<HTMLDivElement> = useRef(null);
  const tabListRef: RefObject<HTMLDivElement> = useRef(null);
  const underlineRef: RefObject<HTMLDivElement> = useRef(null);
  const sliderRef: RefObject<HTMLDivElement> = useRef(null);
  // const [mount, setMount] = useState(false);

  const getTabsMeta = useCallback((): Promise<{
    tabsMeta: ITabsMeta | undefined;
    tabMeta: DOMRect | undefined;
  }> => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const tabsNode = tabsRef.current;
        let tabsMeta = undefined;
        if (tabsNode) {
          const rect = tabsNode.getBoundingClientRect();
          tabsMeta = {
            clientWidth: tabsNode.clientWidth,
            scrollLeft: tabsNode.scrollLeft,
            scrollTop: tabsNode.scrollTop,
            scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, direction),
            scrollWidth: tabsNode.scrollWidth,
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
          };
        }

        let tabMeta = undefined;
        if (tabsNode) {
          const { children = [] } = tabListRef.current || {};

          if (children.length > 0) {
            const tab = children[valueToIndex.get(value)];
            tabMeta = tab ? tab.getBoundingClientRect() : undefined;
          }
        }
        resolve({ tabsMeta, tabMeta });
      });
    });
  }, [direction, value, valueToIndex]);

  const updateIndicatorState = useCallback(async () => {
    const { tabsMeta, tabMeta } = await getTabsMeta();

    let startValue = 0;
    const startIndicator = 'left';

    if (tabMeta && tabsMeta) {
      const correction = tabsMeta.scrollLeft;
      startValue = tabMeta[startIndicator] - tabsMeta[startIndicator] + correction;
    }

    const newIndicatorStyle = {
      [startIndicator]: startValue,
      width: tabMeta ? tabMeta.width : 0,
      transition: 'all .3s ease 0.2s',
    };

    if (isNaN(indicatorStyle[startIndicator]) || isNaN(indicatorStyle.width)) {
      setIndicatorStyle(newIndicatorStyle);
    } else {
      const dStart = Math.abs(indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator]);
      const dSize = Math.abs(indicatorStyle.width - newIndicatorStyle.width);

      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle);
      }
    }
  }, [getTabsMeta, indicatorStyle]);

  const scroll = (scrollValue: number, { animation = true } = {}) => {
    const tabsNode = tabsRef.current;
    if (!tabsNode) return;
    if (animation) {
      animate(scrollStart, tabsNode, scrollValue, {
        duration: 100,
      });
    } else {
      tabsNode[scrollStart] = scrollValue;
    }
  };

  const moveTabsScroll = useCallback((delta: number) => {
    const tabsNode = tabsRef.current;
    if (!tabsNode) return;
    let scrollValue = tabsNode[scrollStart];

    scrollValue += delta;
    scrollValue *= 1;

    scroll(scrollValue);
  }, []);

  const getScrollSize = () => {
    if (!tabListRef.current || !tabsRef.current) return 0;
    const containerSize = tabsRef.current[clientSize];
    let totalSize = 0;
    const children = Array.from(tabListRef.current.children);

    for (let i = 0; i < children.length; i += 1) {
      const tab = children[i];
      if (totalSize + tab![clientSize] > containerSize) {
        break;
      }
      totalSize += tab![clientSize];
    }
    return totalSize;
  };

  const handleStartScrollClick = useCallback(() => {
    const scrollSize = getScrollSize();
    if (!scrollSize) return;
    moveTabsScroll(-1 * scrollSize);
  }, [moveTabsScroll]);

  const handleEndScrollClick = useCallback(() => {
    const scrollSize = getScrollSize();
    if (!scrollSize) return;
    moveTabsScroll(scrollSize);
  }, [moveTabsScroll]);

  const updateSliderBackground = useCallback(
    async (animate = true) => {
      if (variant !== 'slider' || !sliderRef || !sliderRef.current) return;
      const { tabMeta, tabsMeta } = await getTabsMeta();
      if (!tabMeta || !tabsMeta) return;

      if (tabMeta && tabsMeta) {
        sliderRef.current.style.left = `${tabMeta.left - tabsMeta.left + 4}px`;
        sliderRef.current.style.width = `${tabMeta.width}px`;
        if (animate) {
          sliderRef.current.style.transition = 'left 0.3s, width 0.3s';
        }
      }
    },
    [getTabsMeta, variant],
  );

  const updateScrollButtonState = useCallback(() => {
    if (!tabListRef || !tabsRef.current) return;
    const { scrollWidth, clientWidth } = tabsRef.current;
    const scrollLeft = getNormalizedScrollLeft(tabsRef.current, direction);

    const showStartScroll = scrollLeft > 1;
    const showEndScroll = scrollLeft < scrollWidth - clientWidth - 1;

    if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
      setDisplayScroll({ start: showStartScroll, end: showEndScroll });
    }
  }, [direction, displayScroll.end, displayScroll.start]);

  const { run: handleResize } = useDebounceFn(
    () => {
      updateIndicatorState();
      updateScrollButtonState();
    },
    {
      wait: 166,
    },
  );

  const { run: handleScroll } = useDebounceFn(
    () => {
      updateScrollButtonState();
    },
    {
      wait: 166,
    },
  );

  const conditionalElements = useMemo(
    () => ({
      scrollButtonStart:
        displayScroll.start && variant !== 'slider' ? (
          <div className="kux-tabs_scroll_left" onClick={handleStartScrollClick}>
            <ArrowLeftIcon rtl className="kux-tabs_scroll_left_icon" />
            <div className="kux-tabs_scroll_left_bkg"></div>
          </div>
        ) : null,
      scrollButtonEnd:
        displayScroll.end && variant !== 'slider' ? (
          <div className="kux-tabs_scroll_right" onClick={handleEndScrollClick}>
            <div className="kux-tabs_scroll_right_bkg"></div>
            <ArrowRightIcon rtl className="kux-tabs_scroll_right_icon" />
          </div>
        ) : null,
      indicator:
        variant === 'line' && showUnderline ? (
          <span
            className="kux-tabs_underline_wrap"
            ref={underlineRef}
            style={{
              ...indicatorStyle,
            }}
          >
            <span className={clx('kux-tabs_underline', `kux-tabs_underline_${size}`)}></span>
          </span>
        ) : null,
    }),
    [
      displayScroll.end,
      displayScroll.start,
      handleEndScrollClick,
      handleStartScrollClick,
      indicatorStyle,
      showUnderline,
      size,
      variant,
    ],
  );

  useEffect(() => {
    const tabsNode = tabsRef.current;
    if (!tabsNode) return;
    tabsNode.addEventListener('scroll', handleScroll, {
      passive: true,
    });
    window.addEventListener('resize', handleResize);

    return () => {
      tabsNode.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, handleScroll, updateIndicatorState, updateScrollButtonState]);

  useEffect(() => {
    updateIndicatorState();
    updateScrollButtonState();
    updateSliderBackground();
  });

  useEffect(() => {
    updateSliderBackground(false);
  }, [updateSliderBackground]);

  return (
    <div
      className={clx('kux-tabs', `kux-tabs_${variant}`, `kux-tabs_${variant}_${size}`, className, {
        [`kux-tabs_${variant}_block`]: sliderBlock,
      })}
    >
      {conditionalElements.scrollButtonStart}
      {variant === 'slider' && (
        <div
          className={clx('kux-tabs_slider_trans', `kux-tabs_slider_trans_${size}`)}
          ref={sliderRef}
        />
      )}
      <div className="kux-tabs_scroller" ref={tabsRef}>
        <div
          className={clx('kux-tabs_list', variant === 'line' ? `kux-tabs_list_${size}` : '')}
          role="tablist"
          ref={tabListRef}
        >
          {tabs.map((tab, index) => {
            const isActive = tab.value === value;
            valueToIndex.set(tab.value, index);
            return (
              <div
                key={tab.value}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                className={clx(
                  'kux-tabs_tab',
                  `kux-tabs_tab_${variant}`,
                  `kux-tabs_tab_${variant}_${size}`,
                  {
                    [`kux-tabs_tab_${variant}_active`]: isActive,
                  },
                )}
                onClick={() => onChange(tab.value)}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
        {conditionalElements.indicator}
      </div>
      {conditionalElements.scrollButtonEnd}
    </div>
  );
}
