/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { styled, Tab, Tabs, useResponsive } from '@kux/mui';
import debounce from 'lodash/debounce';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

const TabsWrapper = styled.div`
  padding: 0 16px 8px;
  margin-bottom: -8px;
  position: -webkit-sticky;
  position: sticky;
  top: ${({ top }) => `${top}px`};
  background-color: ${(props) => props.theme.colors.overlay};
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .extra {
    margin-left: 16px;
    text-align: right;
  }

  .KuxTab-TabItem {
    line-height: 34px;
  }

  .KuxTabs-container .KuxTabs-scrollButton {
    display: none;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: -16px;
    padding: 0 0 16px;

    .KuxTabs-container .KuxTabs-scrollButton {
      display: flex;
    }
  }
`;

const tabHeight = 34;

/**
 * 吸顶Tabs tab内容平铺展示，滚动到当前内容，对应tab选中，点击tab，页面滚动到对应内容
 * @param
 */
const StickyTabs = ({ items, extra, topHeight, className, tabConfig = {} }) => {
  const [cardTops, setCardTops] = useState([]);
  const [tabKey, setTabKey] = useState('');

  const lockRef = useRef(null);
  const timeoutRef = useRef(null);

  const dispatch = useDispatch();
  const { isRTL } = useLocale();
  const { lg } = useResponsive();
  const isInApp = JsBridge.isApp();

  const scrollTop = useMemo(() => {
    const _padding = lg ? 40 : 24;
    return topHeight + tabHeight + _padding - 1; // +tab高度和padding
  }, [topHeight, lg]);

  const handleTypeChange = useCallback(
    debounce((e, value) => {
      lockRef.current = true;
      const ele = document.getElementById(value);
      if (ele) {
        window.scrollTo({
          top: ele.offsetTop - scrollTop + (isInApp ? 8 : 0),
          behavior: 'smooth',
        });
      }

      setTabKey(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 安卓兼容问题，会跳转到上一个tab，锁定滚动设置tab,1s中后再放开
      timeoutRef.current = setTimeout(() => {
        lockRef.current = false;
      }, 1000);
    }, 60),
    [scrollTop, isInApp, tabKey],
  );

  const handleScroll = useCallback(
    debounce(() => {
      if (lockRef.current) return;
      if (cardTops?.length) {
        const top = window.document?.scrollingElement?.scrollTop;
        const scrollHeight = window.document?.scrollingElement?.scrollHeight;
        const clientHeight = window.document?.scrollingElement?.clientHeight;
        let cardIndex = 0;
        cardTops?.map((cardTop, index) => {
          if (top >= cardTop - scrollTop) {
            cardIndex = index;
          }
        });
        // 到底算最后一个
        if (top >= scrollHeight - clientHeight - 2) {
          cardIndex = cardTops?.length - 1;
        }
        setTabKey(items[cardIndex]?.id);
      }
    }, 200),
    [dispatch, cardTops, items, scrollTop],
  );

  useEffect(() => {
    return () => {
      lockRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (items?.length) {
      const arr = items?.map((item, index) => {
        const ele = document.getElementById(item?.id);
        return ele?.offsetTop;
      });
      setCardTops(arr);
    }
  }, [items, scrollTop]);

  useEffect(() => {
    if (items?.length && !tabKey) {
      setTabKey(items[0]?.id);
    }
  }, [items, tabKey]);

  useEffect(() => {
    if (window && window.addEventListener) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <TabsWrapper top={topHeight - 1} className={className}>
      <Tabs
        value={tabKey}
        onChange={handleTypeChange}
        variant="bordered"
        size="small"
        showScrollButtons={false}
        centeredActive
        direction={isRTL ? 'rtl' : 'ltr'}
        {...tabConfig}
      >
        {items?.map((item) => {
          return <Tab label={item?.label} value={item?.value} key={item?.id} />;
        })}
      </Tabs>
      {!!extra && <div className="extra">{extra}</div>}
    </TabsWrapper>
  );
};

export default memo(StickyTabs);
