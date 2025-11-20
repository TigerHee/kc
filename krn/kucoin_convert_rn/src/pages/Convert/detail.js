/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import ConvertHistoryDetail from 'components/Convert/History/Detail';
import useLang from 'hooks/useLang';
import HeaderPro from 'components/Common/HeaderPro';

const ConvertView = styled.SafeAreaView`
  flex: 1;
  background: ${props => props.theme.colorV2.overlay};
`;

const ConvertHistoryDetailPage = ({route}) => {
  const params = route?.params;
  const {_t} = useLang();

  return (
    <ConvertView>
      <HeaderPro title={_t('x3xgvgpoAkP2XTUuErdR9o')} />
      <ConvertHistoryDetail params={params} />
    </ConvertView>
  );
};
export default ConvertHistoryDetailPage;
