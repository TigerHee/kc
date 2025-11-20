/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import logoPng from '@/assets/share/k-logo.png';

const ShareHeader = () => {
  return (
    <div className="header">
      <img src={logoPng} alt="logo" />
    </div>
  );
};

export default React.memo(ShareHeader);
