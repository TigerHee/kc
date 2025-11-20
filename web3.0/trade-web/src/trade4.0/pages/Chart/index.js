/**
 * Owner: borden@kupotech.com
 */
import React, { memo, useMemo, useContext } from 'react';
import { useResponsive } from '@kux/mui';
import Header from '@/pages/Chart/components/Header';
import Content from '@/pages/Chart/components/Content';
import MarginGuide from '@/pages/Chart/components/MarginGuide';
import ComponentWrapper from '@/components/ComponentWrapper';
import { useChart, useChartInit } from '@/pages/Chart/hooks/useChart';
import { useChartSavedDataInit } from '@/pages/Chart/hooks/useChartSavedData';
import { useMarginGuideInit } from './hooks/useMarginGuide';
import { name, WrapperContext } from './config';
import { Content as Wrapper, ContentWrapper } from './style';
import { useDispatch, useSelector } from 'dva';

const ChartContent = () => {
  const isDragging = useSelector((state) => state.setting.isDragging);
  useChartSavedDataInit();
  useChartInit();
  const { sm } = useResponsive();
  const { showTab } = useChart();
  const screen = useContext(WrapperContext);
  const { showMarginGuide } = useMarginGuideInit();

  const showHeader = useMemo(() => {
    // sm\md断点的时候不显示header 和 guide
    return !(screen === 'md' || screen === 'sm') && sm && showTab;
  }, [screen, showTab, sm]);

  const contentClassName = useMemo(() => {
    if (showMarginGuide && showHeader) {
      return 'all';
    } else if (showHeader) {
      return 'only-header';
    }
    return '';
  }, [showMarginGuide, showHeader]);

  return (
    <Wrapper className="chart" isDragging={isDragging}>
      {showHeader ? <Header /> : null}
      <ContentWrapper className={contentClassName}>
        <Content />
      </ContentWrapper>

      {showMarginGuide && showHeader ? <MarginGuide /> : null}
    </Wrapper>
  );
};

export default memo(() => {
  return (
    <ComponentWrapper name={name} breakPoints={[281, 480, 768, 1024]}>
      <ChartContent />
    </ComponentWrapper>
  );
});
