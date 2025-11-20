/**
 * Owner: willen@kupotech.com
 */
// 数据持久化配置入口
import {AsyncStorage} from 'react-native';
import {persistReducer, persistStore} from 'redux-persist';
import symbols from './symbols';
import convert from './convert';
// import order from './order';
import dismiss from './dismiss';

const persistConfig = {
  key: 'krn',
  storage: AsyncStorage,
  whitelist: ['symbols', 'convert', 'dismiss'],
  transforms: [symbols, convert, dismiss],
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
