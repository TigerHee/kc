/**
 * Owner: jessie@kupotech.com
 */
import React, { useState } from 'react';
import Script from 'react-load-script';

const SCRIPT_COUNT = 2;
let _loadCount = 0;

const ScriptLoad = ({ children }) => {
  const [count, setCount] = useState(0);
  const handleLoaded = () => {
    _loadCount += 1;
    setCount(_loadCount);
  };

  if (
    count === SCRIPT_COUNT ||
    (window.Datafeeds && window.TradingView && window.TradingView.widget)
  ) {
    return children;
  }

  return (
    <React.Fragment>
      <Script
        url={`${_NATASHA_PATH_}/charting_library_24/charting_library.standalone.js`}
        onLoad={handleLoaded}
      />
      <Script
        url={`${_PUBLIC_PATH_}charting_library_24/datafeed.js`}
        onLoad={handleLoaded}
      />
    </React.Fragment>
  );
};
export default ScriptLoad;
