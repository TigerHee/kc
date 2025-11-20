/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { NewGuide, styled, useShowWithdrawMargin } from '@/pages/Futures/import';

const GuidePlaceholder = styled.div`
  position: absolute;
  top: 6px;
  right: 32px;
  width: 1px;
  height: 1px;
  z-index: -1;
`;

const NewGuideLogic = () => {
  const showGuide = useShowWithdrawMargin();
  return (
    <NewGuide defaultOpen={showGuide} type="withdraw-margin-new" path="/trade" placement="top">
      <GuidePlaceholder />
    </NewGuide>
  );
};

export default React.memo(NewGuideLogic);
