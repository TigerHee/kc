import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {setStatusStyle} from '@krn/bridge';

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
