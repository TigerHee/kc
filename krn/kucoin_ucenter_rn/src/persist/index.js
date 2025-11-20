// 数据持久化配置入口
import {AsyncStorage} from 'react-native';
import {persistReducer, persistStore} from 'redux-persist';
import app from './app';
import kyc from './kyc';
import {storagePrefix} from 'config';
import {version} from '../../package.json';

const keyPrefix = 'persist:';
const persistKey = `${storagePrefix}:${version}`;

// 清理旧版本的持久化数据
AsyncStorage.getAllKeys((err, res) => {
  if (!err) {
    (res || []).map(key => {
      // 匹配所有持久化数据
      if (new RegExp(`${keyPrefix}${storagePrefix}`).test(key)) {
        // 清除非当前版本的持久化数据
        if (!new RegExp(`${keyPrefix}${persistKey}`).test(key)) {
          AsyncStorage.removeItem(key);
        }
      }
    });
  }
});

const persistConfig = {
  keyPrefix,
  key: persistKey,
  storage: AsyncStorage,
  whitelist: ['app', 'kyc'],
  transforms: [app, kyc],
};

const persistEnhancer =
  () => createStore => (reducer, initialState, enhancer) => {
    const store = createStore(
      persistReducer(persistConfig, reducer),
      initialState,
      enhancer,
    );
    const persist = persistStore(store, null);
    return {...store, persist};
  };

export default persistEnhancer;
