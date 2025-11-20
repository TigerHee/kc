/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import ConvertHistory from 'components/Convert/History';
import useLang from 'hooks/useLang';
import {useFocusEffect} from '@react-navigation/native';
import useTracker from 'hooks/useTracker';
import HeaderPro from 'components/Common/HeaderPro';

const ConvertView = styled.SafeAreaView`
  flex: 1;
  background: ${props => props.theme.colorV2.overlay};
`;

const ConvertHistoryPage = props => {
  const {_t} = useLang();
  const {onPageExpose} = useTracker();

  useFocusEffect(
    React.useCallback(() => {
      //页面曝光埋点
      onPageExpose();
    }, []),
  );
  return (
    <ConvertView>
      <HeaderPro title={_t('vaGiwsHPkmrCDEEJT7YkPr')} />
      <ConvertHistory {...props} />
    </ConvertView>
  );
};
export default ConvertHistoryPage;
