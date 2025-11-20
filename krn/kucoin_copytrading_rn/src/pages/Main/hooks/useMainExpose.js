import {useEffect} from 'react';
import {tracker} from '@krn/toolkit';

import {MainPageIds} from 'constants/tracker';
import {MAIN_TAB_KEYS} from '../constant';

const MainTabKey2MainPageIds = {
  [MAIN_TAB_KEYS.home]: MainPageIds.Board,
  [MAIN_TAB_KEYS.myCopies]: MainPageIds.MyCopyPage,
  [MAIN_TAB_KEYS.myLeading]: MainPageIds.MyLeadPage,
};

export const useMainExpose = ({activeTabKey}) => {
  useEffect(() => {
    const pageId = MainTabKey2MainPageIds[activeTabKey];
    tracker.onPageExpose({
      pageId,
    });
    const {prePageId, preLoadTime} = tracker.getConfigInfo();
    if (prePageId) {
      // 前一个页面的停留时长
      tracker.onPageView({
        pageId: prePageId,
        eventDuration: Date.now() - preLoadTime,
      });
    }

    tracker.setConfigInfo({
      prePageId: pageId,
      preLoadTime: Date.now(),
    });
  }, [activeTabKey]);
};
