/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo, useEffect, useState} from 'react';
import styled from '@emotion/native';
import Swiper from 'react-native-swiper';
import {useRef} from 'react';
import Histroy from './Histroy';
import Current from './Current';
import {HISTORY_TYPE_LIST} from '../config';
import {TouchableWithoutFeedback} from 'react-native';
import filterImg from 'assets/convert/filter.png';
import filterActiveImg from 'assets/convert/filter_active.png';
import Filter from 'components/Convert/History/Filter';
import {Tabs} from '@krn/ui';
import useLang from 'hooks/useLang';
import {useDispatch} from 'react-redux';
import {Platform} from 'react-native';
import {useTheme} from '@krn/ui';

const {Tab} = Tabs;

const Wrapper = styled.View`
  flex: 1;
`;
const TabsPro = styled(Tabs)`
  flex: 1;
`;
const TabWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FilterWrapper = styled.View`
  height: 100%;
  padding: 13px 16px 0;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({theme}) => theme.colorV2.divider8};
`;

const HistoryImg = styled.Image`
  width: 20px;
  height: 20px;
`;

const RightSlot = styled.View`
  margin-left: auto;
`;

const HistoryPage = props => (
  <Wrapper>
    <Histroy {...props} />
  </Wrapper>
);

const CurrentPage = props => (
  <Wrapper>
    <Current {...props} />
  </Wrapper>
);

/**
 * NewIndex
 */
const NewIndex = memo(props => {
  const {route, ...restProps} = props;
  const params = route?.params;
  const [value, setValue] = useState(HISTORY_TYPE_LIST[0].value);
  const [showFilter, setShowFilter] = useState(false);
  const {_t} = useLang();
  const swiper = useRef();
  const dispatch = useDispatch();
  const {isRTL} = useTheme();
  const handleFilterPress = () => {
    setShowFilter(true);
  };
  useEffect(() => {
    if (params?.showFilter) {
      setShowFilter(params?.showFilter);
    }
    // 限价单查看订单 当前委托
    if (params?.tab === 'CURRENT') {
      setTimeout(() => {
        handleIndexChange(1, true);
      }, 300);
    }
  }, [params]);

  useEffect(() => {
    // 如果等于当前委托要刷新列表
    if (value === 'CURRENT') {
      dispatch({type: 'order/queryCurrentOrders', payload: {pageIndex: 1}});
    }
  }, [value]);

  const handleIndexChange = (v, scroll) => {
    const _value = HISTORY_TYPE_LIST[v].value;
    setValue(_value);

    if (scroll) {
      swiper?.current?.scrollTo(v);
    }
  };
  return (
    <Wrapper {...restProps}>
      <TabWrapper>
        <TabsPro
          size="large"
          value={value}
          onChange={(v, i) => handleIndexChange(i, true)}>
          {HISTORY_TYPE_LIST.map(({label, value: _value}) => (
            <Tab value={_value} label={_t(label)} key={_value} />
          ))}
        </TabsPro>

        <FilterWrapper>
          {value === 'HISTORY' && (
            <RightSlot>
              <TouchableWithoutFeedback
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={handleFilterPress}>
                <HistoryImg
                  source={showFilter ? filterActiveImg : filterImg}
                  autoRotateDisable
                />
              </TouchableWithoutFeedback>
            </RightSlot>
          )}
        </FilterWrapper>
      </TabWrapper>

      <Wrapper>
        <Swiper
          showsPagination={false}
          ref={swiper}
          loop={false}
          onIndexChanged={v => handleIndexChange(v, false)}
          style={{
            ...Platform.select({
              android: {
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            }),
          }}>
          <HistoryPage {...restProps} />
          <CurrentPage {...restProps} />
        </Swiper>
      </Wrapper>

      <Filter
        setShowFilter={setShowFilter}
        show={showFilter}
        params={params}
        tab={value}
      />
    </Wrapper>
  );
});

export default NewIndex;
