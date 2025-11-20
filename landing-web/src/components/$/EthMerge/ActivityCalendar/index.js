/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'dva';
import { debounce } from 'lodash';
import { sensors } from 'src/utils/sensors';
import { openPage } from 'src/helper';
import { KUCOIN_HOST } from 'utils/siteConfig';


import { addLangToPath, _t } from 'src/utils/lang';
import { useIsMobile } from 'src/components/Responsive';

import {
  CalendarWrapper,
  SectionHeader,
  Index,
  Wrapper,
  SmallCalendarWrapper,
  CalendarImg,
  CalendarHeader,
} from './StyledComps';
import SmallItem from './SmallItem';

import { ActivityWeeks } from './config';

const ActivityCalendar = () => {
  const { isInApp } = useSelector(state => state.app);
  const isMobile = useIsMobile();

  // 跳转页面
  const goToPage = useCallback(
    debounce(
      data => {
        // 埋点
        sensors.trackClick([data?.blockid, '1']);
        let url;
        if (isInApp) {
          url = data?.getAppUrl(KUCOIN_HOST);
        } else if (isMobile) {
          url = data?.getH5Url(KUCOIN_HOST);
        } else {
          url = data?.getPcUrl(KUCOIN_HOST);
        }
        // 跳转
        if (url) {
          openPage(isInApp, addLangToPath(url));
        }
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [isInApp, isMobile],
  );
  return (
    <Wrapper>
      <Index>
        <SectionHeader>{_t('aUZfMP6ajdQPWo2fgwwjVP')}</SectionHeader>
        <CalendarWrapper>
          <CalendarImg />
          <CalendarHeader />
          <SmallCalendarWrapper>
            {ActivityWeeks.map((i, index) => (
              <SmallItem data={i} key={`SmallItem-${index}`} onClick={goToPage} />
            ))}
          </SmallCalendarWrapper>
        </CalendarWrapper>
      </Index>
    </Wrapper>
  );
};

export default ActivityCalendar;
