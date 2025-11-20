/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { isInApp } from '@/hooks/common/useApp';

import AppShareModal from './AppShareModal';
import { useGetBaseShareInfo } from './hook';
import PCShareModal from './PCShareModal';

const PnlShare = () => {
  useGetBaseShareInfo();

  if (isInApp()) {
    return <AppShareModal />;
  }

  return <PCShareModal />;
};

export default React.memo(PnlShare);
