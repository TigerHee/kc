import React, {useRef, useState} from 'react';
import {Platform} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies, import/default
import Swiper from 'react-native-swiper';
import styled from '@emotion/native';
import {Empty, Tabs, useTheme} from '@krn/ui';

import useLang from 'hooks/useLang';
import FixedAmountFormContent from './FixedAmountFormContent';
import FixedRateFormContent from './FixedRateFormContent';
const {Tab} = Tabs;

const PageView = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colorV2.background};
`;

const ContentView = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

const TabsWrapper = styled.View`
  align-items: center;
  border-radius: 16px 16px 0 0;
  background: ${({theme}) => theme.colorV2.overlay};
`;

const PageViewWrapper = styled.ScrollView`
  flex: 1;
  padding-top: 16px;
`;

/**
 * 做个懒加载
 */
const SwiperItemWrapper = ({children, shouldRender, ...restProps}) => {
  return (
    <PageViewWrapper>
      {shouldRender ? children : <Empty style={{marginTop: -200}} />}
    </PageViewWrapper>
  );
};

const TAB_TYPE_LIST = [
  {
    value: 'FixedRateFormContent',
    label: 'ac10631ee6b74000a1de',
    blockId: 'simpleOptions',
  },
  {
    value: 'FixedAmountFormContent',
    label: 'ac78f8ba5e5d4000acdb',
    blockId: 'positionButton',
  },
];

const defaultValue = TAB_TYPE_LIST[0].value;

export const EditFormLayout = props => {
  const {fixedRateFormMethods, fixedAmountFormMethods, handleChangeTab} = props;
  const swiper = useRef();
  const {isRTL} = useTheme();
  const {_t} = useLang();
  const [cacheRenders, setCacheRenders] = useState({
    [defaultValue]: true,
  });
  const [value, setValue] = useState(defaultValue);

  const handleIndexChange = (idx, scroll) => {
    const {value: _value, blockId} = TAB_TYPE_LIST[idx];
    setValue(_value);
    setCacheRenders(prev => ({...prev, [_value]: true}));
    handleChangeTab(idx);
    if (scroll) {
      swiper?.current?.scrollTo(idx);
    }
  };
  return (
    <PageView>
      <TabsWrapper>
        <Tabs
          size="large"
          value={value}
          onChange={(v, i) => handleIndexChange(i, true)}>
          {TAB_TYPE_LIST.map(({label, value: _value}) => {
            return <Tab value={_value} label={_t(label)} key={_value} />;
          })}
        </Tabs>
      </TabsWrapper>

      <ContentView>
        <Swiper
          showsPagination={false}
          ref={swiper}
          loop={false}
          onIndexChanged={v => handleIndexChange(v, false)}
          scrollEnabled={false}
          style={{
            ...Platform.select({
              android: {
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            }),
          }}>
          <SwiperItemWrapper shouldRender={cacheRenders.FixedRateFormContent}>
            <FixedRateFormContent formMethods={fixedRateFormMethods} />
          </SwiperItemWrapper>
          <SwiperItemWrapper shouldRender={cacheRenders.FixedAmountFormContent}>
            <FixedAmountFormContent formMethods={fixedAmountFormMethods} />
          </SwiperItemWrapper>
        </Swiper>
      </ContentView>
    </PageView>
  );
};
