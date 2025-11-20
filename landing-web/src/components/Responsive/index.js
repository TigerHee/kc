/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import { MAX_WIDTH } from 'config';

export const useIsMobile = () => {
  const isMobile = useMediaQuery({ maxWidth: MAX_WIDTH });
  return isMobile;
};

const ResponsiveMB = (props) => {
  return (
    <MediaQuery
      maxWidth={MAX_WIDTH}
      {...props}
    />
  );
};

const ResponsivePC = (props) => {
  return (
    <MediaQuery
      minWidth={MAX_WIDTH + 1}
      {...props}
    />
  );
};

ResponsivePC.Mobile = ResponsiveMB;

export default ResponsivePC;
