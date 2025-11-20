// 数据持久化配置入口
import {AsyncStorage} from 'react-native';
import {persistReducer, persistStore} from 'redux-persist';

import {storagePrefix} from 'config';
import app from './app';
import futures from './futures';

const persistConfig = {
  key: storagePrefix,
  storage: AsyncStorage,
  whitelist: ['app', 'futures'],
  transforms: [app, futures],
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
