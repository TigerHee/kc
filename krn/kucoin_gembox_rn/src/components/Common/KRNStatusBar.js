/**
 * Owner: roger.chen@kupotech.com
 */
import React from 'react';
import {useEffect} from 'react';
import {setStatusStyle} from '@krn/bridge';
import {Platform, StatusBar} from 'react-native';

const useIOSStatusBridge = ({
  barStyle, // dark-content, light-content, default
}) => {
  useEffect(() => {
    if (barStyle && Platform.OS === 'ios') {
      setStatusStyle(barStyle);
    }
  }, [barStyle]);
};

const KRNStatusBar = props => {
  useIOSStatusBridge(props);
  return Platform.OS === 'android' && <StatusBar {...props} />;
};

export default KRNStatusBar;
