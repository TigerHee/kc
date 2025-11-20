/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';

import Button from '@mui/Button';

import { _t, styled } from '../../../builtinCommon';

const OrderButton = styled(Button)`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  justify-content: flex-start;
  height: 24px;
`;

const PlaceOrderButton = ({ show, onPlaceOrder }) => {
  if (!show) return null;
  return (
    <OrderButton type="brandGreen" variant="text" fullWidth onClick={onPlaceOrder}>
      {_t('calc.order.text')}
    </OrderButton>
  );
};

export default React.memo(PlaceOrderButton);
