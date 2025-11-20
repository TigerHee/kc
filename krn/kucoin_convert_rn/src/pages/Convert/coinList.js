/**
 * Owner: willen@kupotech.com
 */
import CoinSelectList from 'components/Convert/Common/CoinSelectList';
import styled from '@emotion/native';
import React, {useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import useTracker from 'hooks/useTracker';

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: ${props => props.theme.colorV2.overlay};
`;
const ConvertCoinListPage = ({route}) => {
  const params = route?.params;
  const dispatch = useDispatch();
  const {onPageExpose} = useTracker();
  const orderType = params.orderType;

  useFocusEffect(
    React.useCallback(() => {
      //页面曝光埋点
      onPageExpose();
    }, []),
  );

  useEffect(() => {
    if (orderType) {
      dispatch({
        type: 'convert/getConvertCurrencyConfig',
        payload: {
          orderType: orderType,
        },
      });
    }
  }, [orderType]);

  return (
    <Wrapper>
      <CoinSelectList params={params} />
    </Wrapper>
  );
};
export default ConvertCoinListPage;
