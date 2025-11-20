/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';
import { isFuturesNew } from '@/meta/const';
import New from './New';
import Old from './Old';
import InformationDialog from './InformationDialog';
import InformationDrawer from './InformationDrawer';

const TradeInformation = () => {
  return (
    <>
      <New />
      <InformationDialog />
      <InformationDrawer />
    </>
  );
};

export default React.memo(TradeInformation);
