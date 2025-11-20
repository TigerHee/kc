/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useIsMobile } from 'components/Responsive';
import { PcDisableCMSHeader, H5DisableCMSHeader  } from 'config';
import CmsComs from 'components/CmsComs';
import { checkPathname } from 'helper';

/**
 * 对于不使用cms 配置的TDK等Header的，在config中配置禁用PcDisableCMSHeader/H5DisableCMSHeader
 */
export default () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    if (H5DisableCMSHeader.length && checkPathname(H5DisableCMSHeader)) {
      return null;
    }
  }

  if (PcDisableCMSHeader.length && checkPathname(PcDisableCMSHeader)) {
    return null;
  }

  return <CmsComs.Heads run="com.head" />;
}
