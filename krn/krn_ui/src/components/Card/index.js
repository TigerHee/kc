/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import registerAPI from 'utils/registerAPI';
import API from 'components/Card/API';

const CardWrapper = styled.View`
  background: ${({ theme }) => theme.colorV2.overlay};
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 20px;
  min-height: 32px;
  border: 1px solid ${({ theme }) => theme.colorV2.cover12};
`;

const Card = ({ children, style }) => {
  return <CardWrapper style={style}>{children}</CardWrapper>;
};

registerAPI(Card, API);
export default Card;
