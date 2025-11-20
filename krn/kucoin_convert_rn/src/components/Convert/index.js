/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo, useState, useEffect} from 'react';
import styled from '@emotion/native';
import FormInput from './FormInput';
import Notice from 'components/Convert/FormInput/Notice';
import {TRADE_TYPE_LIST} from './config';
import {useDispatch, useSelector} from 'react-redux';
import useLang from 'hooks/useLang';
import {Empty, Tabs} from '@krn/ui';
import More from './FormInput/More';
import useCompliantRule from 'hooks/useCompliantRule';

const {Tab} = Tabs;

const Wrapper = styled.View`
  flex: 1;
`;

const MoreWrapper = styled.View`
  margin: 16px;
`;

const ConvertPage = props => (
  <Wrapper>
    <FormInput {...props} />
  </Wrapper>
);

const ScrollWrapper = styled.ScrollView`
  flex: 1;
`;

/**
 * NewIndex
 */
const NewIndex = memo(props => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(TRADE_TYPE_LIST[0].value);
  // const swiper = useRef();
  const {_t} = useLang();
  const baseConfig = useSelector(state => state.convert.baseConfig);
  useCompliantRule();
  const {...restProps} = props;

  const handleIndexChange = (v, scroll) => {
    const _value = TRADE_TYPE_LIST[v].value;
    setValue(_value);

    dispatch({
      type: 'convert/update',
      payload: {
        orderType: _value,
        focusType: 'from',
        realInputFocus: 'from',
        formStatus: 'normal',
        triggerEmptyValidate: false,
        currentEstimates: 'to',
      },
    });

    dispatch({
      type: 'convert/getAllSymbolList',
    });
  };

  // 获取询价间隔
  useEffect(() => {
    dispatch({type: 'convert/getPriceRefreshGap'});
  }, [dispatch]);

  const List = TRADE_TYPE_LIST.map(item => ({
    ...item,
    label: _t(item.label),
  }));
  return (
    <Wrapper {...restProps}>
      <Notice />
      {/* 停机维护中 */}
      {baseConfig.downtime ? (
        <Wrapper>
          <Empty imgType="suspension" text={_t('cmfHzuvVq7YLFNHz3cmb5P')} />
          <MoreWrapper>
            <More />
          </MoreWrapper>
        </Wrapper>
      ) : (
        <>
          <Tabs
            size="large"
            value={value}
            onChange={(v, i) => handleIndexChange(i, true)}>
            {List.map(({label, value: _value}) => (
              <Tab label={label} value={_value} key={_value} />
            ))}
          </Tabs>
          <ScrollWrapper
            showsVerticalScrollIndicator={false}
            // 解决点击 android 软键盘点击右上角下拉时，页面需要点击多次事件才生效 https://likfe.com/2018/10/23/RN-keyboardShouldPersistTaps
            keyboardShouldPersistTaps="handled">
            <ConvertPage {...restProps} />
          </ScrollWrapper>
        </>
      )}
    </Wrapper>
  );
});

export default NewIndex;
