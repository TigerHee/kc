// import './src/utils/computedPx';
import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';

LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Module KRN',
  'Overriding preevious layout animation',
]);

// 与 scripts/buildBundle.js中的moduleName一致
AppRegistry.registerComponent('app', () => App);
