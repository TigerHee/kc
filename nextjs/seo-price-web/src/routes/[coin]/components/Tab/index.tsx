/**
 * Owner: will.wang@kupotech.com
 */

import { Tab, Tabs, useResponsive } from '@kux/mui-next';
import { debounce, set } from 'lodash';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useScreen from '@/hooks/useScreen';
import styles from './style.module.scss'
import useTranslation from '@/hooks/useTranslation';
import { useCoinDetailStore } from '@/store/coinDetail';
import { session } from '@/tools/kcSession';
import { trackClick } from 'gbiz-next/sensors';
import { IS_CLIENT } from '@/config/env';
import clsx from 'clsx';
import { useMount, useThrottleFn } from 'ahooks';
import { useRouter } from 'kc-next/compat/router';
import { usePriceStore } from '@/store/price';
import { bootConfig } from 'kc-next/boot';
import { isApp } from '@/config/base';

const tabsConfig = {
  overview: {
    value: 'overview',
    id: 'price_overview',
  },
  about: {
    value: 'about',
    id: 'price_about',
  },
  analysis: {
    value: 'analysis',
    id: 'price_analysis',
  },
  faq: {
    value: 'faq',
    id: 'price_faq',
  },
  trade: {
    value: 'trade',
    id: 'price_trade',
  },
};


const RenderLabel = (props: { i18nKey: string, param?: Record<string, string>, clicked?: boolean }) => {
  const { i18nKey: key, param, clicked } = props;
  const { _t } = useTranslation();
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    // 服务端不能渲染这个dot, 状态不一致
    if (!IS_CLIENT) return;
    setShowDot(!clicked)
  }, [clicked])

  return (
    <div className={styles.labelWrapper}>
      {_t(key, param)}
      {showDot ? <div className={styles.dot} /> : null }
    </div>
  );
};



const PricePageTab = () => {
  const router = useRouter();
  const coin = router?.query.coin as string;
  const { isSm } = useScreen();
  const coinInfo = useCoinDetailStore((state) => state.coinInfo);
  const [selectTab, setselectTab] = useState(tabsConfig.overview.value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  const { md, lg } = useResponsive();

  const lastScrollTopRef = useRef(0);

  const totalHeaderHeight = usePriceStore(s => s.totalHeaderHeight);

  const strickyRef = useRef({
    sticky: false,
    isMd: !md,
    onClickScroll: { startOnClick: false, top: 0 },
    selectTab: selectTab,
  });

  const [tabClickedState, setTabClickedState] = useState({
    overview: true,
    about: false,
    analysis: false,
    faq: false,
    trade: false,
  });


  // 更新红点
  const handleUpdateStore = useCallback(
    (key, val) => {
      session.setItem(`${coin}_tab_click`, {
        ...tabClickedState,
        [key]: val,
      });

      setTabClickedState(s => ({
        ...s,
        [key]: val,
      }))
    },
    [coin, tabClickedState],
  );

  useEffect(() => {
    strickyRef.current.isMd = !md;
  }, [md]);

  const scrollToEle = useCallback(
    (tab) => {
      const targetElement = document.querySelector(`#${tabsConfig[tab].id}`);
      if (targetElement && typeof window !== 'undefined') {
        const { top } = targetElement.getBoundingClientRect();
        const headerOffset = totalHeaderHeight + 60;
        const offsetPosition = top + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        strickyRef.current.onClickScroll.top = offsetPosition;
      }
    },
    [strickyRef,totalHeaderHeight],
  );

  const handleClick = React.useCallback(
    (tab) => {
      strickyRef.current.onClickScroll.startOnClick = true;
      const blockId = tab.replace(tab[0], tab[0].toUpperCase());
      trackClick(['BScoinDetail', [blockId, '1']], { symbol: coin }); // 分析页没有单独注册 pageIdMap，这里指定 pageid
      scrollToEle(tab);
      setselectTab(tab);
      strickyRef.current.selectTab = tab;
      handleUpdateStore(tab, true);
    },
    [coin, handleUpdateStore, scrollToEle],
  );

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (wrapperRef?.current) {
        const { top } = wrapperRef.current.getBoundingClientRect();
        if (strickyRef.current.onClickScroll.startOnClick) {
          // 点击tab后滚动界面，不需要设置tab
          const scrollTopValue = window.scrollY || document.documentElement.scrollTop;
          const targetVal = strickyRef.current.onClickScroll.top;
          if (Math.abs(scrollTopValue - targetVal) < 10) {
            strickyRef.current.onClickScroll.startOnClick = false;
          }
        }
        if (strickyRef.current.sticky && !strickyRef.current.onClickScroll.startOnClick) {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          //需要设置tab为当前滚动内容的位置
          Object.entries(tabsConfig).find(([key, val]) => {
            const targetElement = document.querySelector(`#${val.id}`);
            if (targetElement) {
              const { top, bottom } = targetElement.getBoundingClientRect();
              const windowHeight = window.innerHeight || document.documentElement.clientHeight;
              const spaceOffset = totalHeaderHeight + 20 + 40;
              if (strickyRef.current.selectTab !== val.value) {
                // 下滑
                if (scrollTop >= lastScrollTopRef.current) {
                  if (top >= totalHeaderHeight && top <= spaceOffset) {
                    strickyRef.current.selectTab = val.value;
                    handleUpdateStore(val.value, true);
                    setselectTab(val.value);
                    return true;
                  }
                } else {
                  // 上滑
                  if (bottom >= windowHeight / 2 && bottom <= windowHeight) {
                    strickyRef.current.selectTab = val.value;
                    handleUpdateStore(val.value, true);
                    setselectTab(val.value);
                    return true;
                  }
                }
              }
            }
          });
          lastScrollTopRef.current = scrollTop;
        }
        if (top <= totalHeaderHeight && !strickyRef.current.sticky) {
          const parentNode = wrapperRef.current.parentNode as HTMLElement;
          const childNodes = wrapperRef.current.childNodes;
          if (parentNode && childNodes) {
            let width = `${parentNode.offsetWidth - 8}px`;
            // column排列
            if (strickyRef.current.isMd) {
              width = '100%';
            }
            (childNodes[0] as HTMLElement).style.width = width;
          }
          strickyRef.current.sticky = true;
          setSticky(true);
        }
        if (top > totalHeaderHeight && strickyRef.current.sticky) {
          strickyRef.current.sticky = false;
          const childNodes = wrapperRef.current.childNodes;
          if (childNodes) {
            (childNodes[0] as HTMLElement).style.width = 'auto';
          }
          setSticky(false);
        }
      }
    }, 6);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [wrapperRef, strickyRef, handleUpdateStore,totalHeaderHeight]);

  const resizeWrapper = useThrottleFn(() => {
    // learn_and_earn_card 计算k线区域剩余的宽度
    let rightDom = document.querySelector('#learn_and_earn_card');
    if (bootConfig._BRAND_SITE_ === 'TH'
    ) {
      rightDom = document.querySelector('#price-coin-rank');
    }
    const contentWrapper = document.querySelector('#price_content_wrapper');
    if (rightDom && contentWrapper && wrapperRef.current) {
      const flexDirection = window.getComputedStyle(contentWrapper).flexDirection;
      let _width = wrapperRef.current.clientWidth;
      if (flexDirection === 'row') {
        _width = contentWrapper.clientWidth - rightDom.clientWidth - 62;
      }
      if (_width > 0) {
        wrapperRef.current.style.width = `${_width}px`;
      }
    }
  }, { wait: 200 });

  useEffect(() => {
    if (!IS_CLIENT) return () => {};
    window.addEventListener('resize', resizeWrapper.run);
    return () => {
      window.removeEventListener('resize', resizeWrapper.run);
    };
  }, [resizeWrapper]);

  useEffect(() => {
    resizeWrapper.run();
  }, [isSm, resizeWrapper]);

  const isSticky = isApp ? false : sticky;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div 
        className={clsx(styles.strickWrapper, {
          [styles.sticky]: isSticky
        })} 
        style={isSticky ? { top: totalHeaderHeight } : {}}
      >
        <Tabs value={selectTab} className={styles.price_tabs}>
          <Tab
            label={<RenderLabel i18nKey='nwNYqByhi7FfRvoHDw898f' param={{}} clicked={tabClickedState.overview} />}
            value={tabsConfig.overview.value}
            onClick={() => handleClick('overview')}
          />
          <Tab
            label={
              <RenderLabel
                i18nKey='sMGAYYLkfBwfrcGdMQzLkx'
                param={{ coinName: coin || '' }}
                clicked={tabClickedState.about}
              />
            }
            value={tabsConfig.about.value}
            onClick={() => handleClick('about')}
          />
          {!(coinInfo.isUnsale || coinInfo.isTemporary) && (
            <Tab
              label={
                <RenderLabel i18nKey='kB4757B3Ka2Ye62a4P5c2C' param={{}} clicked={tabClickedState.analysis} />
              }
              value={tabsConfig.analysis.value}
              data-inspector="inspector_kcs_analyzetab"
              onClick={() => handleClick('analysis')}
            />
          )}
          <Tab
            label={
              <RenderLabel i18nKey='coin.detail.coin.info.faq.title' param={{}} clicked={tabClickedState.faq} />
            }
            value={tabsConfig.faq.value}
            onClick={() => handleClick('faq')}
          />
          {isSm && (
            <Tab
              label={
                <RenderLabel i18nKey='market.all.crypto.btn' param={{}} clicked={tabClickedState.trade} />
              }
              value={tabsConfig.trade.value}
              onClick={() => handleClick('trade')}
            />
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default React.memo(PricePageTab);