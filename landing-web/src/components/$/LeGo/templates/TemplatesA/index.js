/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'hooks';
import { useEventCallback } from '@kufox/mui/hooks';
import { Event } from 'helper';
import { map, debounce, isNil } from 'lodash';
import { ThemeProvider } from '@kufox/mui';
import ByVisible from 'components/$/LeGo/hocs/ByVisible';
// import Notice from 'components/$/MarketCommon/Notice';
import Footer from 'components/$/MarketCommon/Footer';
// import Bonus from 'components/$/MarketCommon/Bonus';
import CommonDialog from 'components/$/MarketCommon/CommonDialog';
import Banner from 'components/$/LeGo/templates/TemplatesA/Banner';
import Step from 'components/$/LeGo/templates/TemplatesA/Step';
import CommonText from 'components/$/LeGo/components/CommonText';
import CommonImg from 'components/$/LeGo/components/CommonImg';
import TextWithMedia from 'components/$/LeGo/components/TextWithMedia';
import NewHeader from 'components/$/LeGo/templates/TemplatesA/NewHeader';

import Empty from 'components/$/LeGo/components/Empty';

import styles from './style.less';

const COMPONENTS_MAP = {
  Banner,
  BlockOne: CommonText,
  BlockTwo: CommonImg,
  BlockThree: Step,
  BlockFour: TextWithMedia,
  BlockFive: CommonText,
};

const TemplatesA = () => {
  const contents = useSelector((state) => state.lego.contents, 'ignore');
  const [headerTheme, setHeaderTheme] = useState('dark');
  const promotionsContentRef = useRef(null);
  const scrollHandler = useEventCallback(
    debounce(() => {
      let bottom = null;
      const bannerElement = document.querySelector('#newPromotionsBanner');
      if (bannerElement) {
        const size = bannerElement.getBoundingClientRect() || {};
        bottom = size?.bottom;
      }
      if (!isNil(bottom) && bottom < 110) {
        // 设置背景色为白色
        setHeaderTheme('light');
      } else {
        // 设置背景色为黑色
        setHeaderTheme('dark');
      }
    }, 200),
  );
  useEffect(() => {
    if (!promotionsContentRef?.current) return;
    const promotionsContent = document.querySelector('#promotionsContent');
    Event.removeHandler(promotionsContent, 'scroll', scrollHandler);
    Event.addHandler(promotionsContent, 'scroll', scrollHandler);
    return () => {
      Event.removeHandler(promotionsContent, 'scroll', scrollHandler);
    };
  }, [scrollHandler]);

  return (
    <ThemeProvider>
      <div className={styles?.promotionsPage} id="promotionsPage" data-inspector="promotionsPage">
        <NewHeader headerTheme={headerTheme} />
        <div
          className={styles?.promotionsContent}
          id="promotionsContent"
          ref={promotionsContentRef}
        >
          {/* <Notice namespace="lego" /> */}
          <div className={styles.contentWrap}>
            {map(contents, (item) => {
              const CustomComponent = COMPONENTS_MAP[item.componentName] || Empty;
              return (
                <ByVisible visible={item.visible} key={item.componentName}>
                  <CustomComponent content={item} />
                </ByVisible>
              );
            })}
          </div>
          {/* <Bonus namespace="lego" /> */}
          <Footer namespace="lego" />
          <CommonDialog namespace="lego" />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default React.memo(TemplatesA);
