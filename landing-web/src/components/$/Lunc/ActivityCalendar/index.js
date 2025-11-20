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

const ActivityCalendar = () => {
  const { isInApp } = useSelector(state => state.app);
  // 跳转页面
  const goToPage = useCallback(
    debounce(
      () => {
        // 埋点
        sensors.trackClick(['Activity', '1']);
        openPage(isInApp, 'https://t.me/KuCoin_Memecoins');
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [isInApp],
  );
  return (
    <Wrapper>
      <Index>
        <SectionHeader>{_t('nA7FUsGoUthByuU6nXcukv')}</SectionHeader>
        <CalendarWrapper>
          <CalendarImg />
          <CalendarHeader />
          <SmallCalendarWrapper>
            <SmallItem onClick={goToPage} />
          </SmallCalendarWrapper>
        </CalendarWrapper>
      </Index>
    </Wrapper>
  );
};

export default ActivityCalendar;
