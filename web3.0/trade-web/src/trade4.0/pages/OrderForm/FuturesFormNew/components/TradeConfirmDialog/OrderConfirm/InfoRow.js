/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import Col from '@mui/Col';
import Row from '@mui/Row';

import { styled } from '../../../builtinCommon';

const InfoRowBox = styled(Row)`
  justify-content: space-between;
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
  .confirm-profit {
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
  }
  .confirm-loss {
    font-weight: 500;
    color: ${(props) => props.theme.colors.secondary};
  }
  .rUnit {
    color: ${(props) => props.theme.colors.text40};
  }
  .costText {
    font-size: 14px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    text-align: right;
  }
`;

const ColBox = styled(Col)`
  margin: 0 2px 0 0;
  color: ${(props) => props.theme.colors.text40};
`;

const InfoRow = (props) => {
  const { title, data, render } = props;
  return (
    <InfoRowBox container>
      <ColBox>{title}</ColBox>
      <Col>{typeof render === 'function' ? render(data) : data}</Col>
    </InfoRowBox>
  );
};

export default React.memo(InfoRow);
