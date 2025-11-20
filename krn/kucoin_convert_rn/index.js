/**
 * Owner: willen@kupotech.com
 */
import './src/utils/computedPx';
import {AppRegistry, LogBox} from 'react-native';
import {storagePrefix} from 'config';
import {storage} from '@krn/toolkit';
import App from './src/App';

storage.init(storagePrefix);

LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Module KRN',
  'Overriding preevious layout animation',
]);

AppRegistry.registerComponent('kucoin_convert_rn', () => App);
