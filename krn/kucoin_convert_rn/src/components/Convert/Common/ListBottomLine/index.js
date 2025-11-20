/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import useLang from 'hooks/useLang';

const LineView = styled.View`
  height: 60px;
  justify-content: center;
  margin-bottom: 20px;
`;
const LineText = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colorV2.text40};
  text-align: center;
`;

const ListBottomLine = ({style}) => {
  const {_t} = useLang();
  return (
    <LineView style={style}>
      <LineText>{_t('list.bottom.no.more.text')}</LineText>
    </LineView>
  );
};

export default ListBottomLine;
