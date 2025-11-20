/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import {getAccountLabelKey} from 'components/Convert/config';
import useLang from 'hooks/useLang';

const Title = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
`;

export default ({type, textStyle}) => {
  const {_t} = useLang();

  const labelKey = getAccountLabelKey(type);

  return <Title style={textStyle}>{type ? _t(labelKey) : '--'}</Title>;
};
