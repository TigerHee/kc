/**
 * Owner: roger.chen@kupotech.com
 */
import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';

LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Module KRN',
  'Overriding preevious layout animation',
]);

// 与 scripts/buildBundle.js中的moduleName一致
AppRegistry.registerComponent('gembox_rn', () => App);
