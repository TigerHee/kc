/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled, withYScreen } from '../builtinCommon';

import Cost from '../components/OrderInfo/Cost';
import MaxOrder from '../components/OrderInfo/MaxOrder';

import { useGetSymbolInfo } from '../hooks/useGetData';
import useIsMobile from '../hooks/useIsMobile';

const InfoWrapper = withYScreen(styled.div`
  margin-top: 16px;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    margin-top: 10px;
  `)}
`);

const OrderInfo = ({ price, size, closeOnly }) => {
  const { symbolInfo } = useGetSymbolInfo();
  const isMobile = useIsMobile();

  if (symbolInfo?.status !== 'Open') {
    return null;
  }

  return (
    <InfoWrapper>
      {isMobile ? (
        <>
          <Cost price={price} size={size} />
          <MaxOrder price={price} closeOnly={closeOnly} />
        </>
      ) : (
        <>
          <Cost price={price} size={size} />
          <MaxOrder price={price} closeOnly={closeOnly} />
        </>
      )}
    </InfoWrapper>
  );
};

export default React.memo(OrderInfo);
