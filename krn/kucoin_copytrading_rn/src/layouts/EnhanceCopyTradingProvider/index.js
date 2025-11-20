import {useMount} from 'ahooks';
import CopyTradeMain from 'pages/Main';
import React, {memo, useMemo} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';

import CopyTradeEnhanceStatusBar from 'components/copyTradeComponents/CopyTradeEnhanceStatusBar';
import MountGlobalModal from 'components/GlobalModal/MountGlobalModal';
import {asyncStoragePersister, queryClient} from 'config/queryClient';
import {useInitCopyTradingData} from 'layouts/hooks/useInitCopyTradingData';
import {getInitialParams} from 'utils/init-router-helper';
import {QueryPreloadController} from 'utils/query-client-cache-controller';
import Router from '../../router';
import BaseLayout from '../index';
import {checkIsMainPage} from './helper';

const isLocalEnv = __DEV__;

const EnhanceCopyTradingProvider = ({lang, isDarkMode, propsFromNative}) => {
  const {route, isLeader} = propsFromNative || {};
  const {name, params} = useMemo(() => getInitialParams(route), [route]);

  const isMainPage = useMemo(() => checkIsMainPage(name), [name]);

  useInitCopyTradingData({isMainPage, isLeader});

  useMount(() => {
    QueryPreloadController.initPreWriteQueriesData();
  });

  return useMemo(() => {
    return (
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{persister: asyncStoragePersister}}>
          <CopyTradeEnhanceStatusBar
            isMainPage={isMainPage && !__DEV__}
            isDarkMode={isDarkMode}
            initRouter={route}
          />

          <BaseLayout lang={lang}>
            {/* //本地开发环境 用 router 包裹 方便调试 */}
            {isMainPage && !isLocalEnv ? (
              <CopyTradeMain initRouteParams={params} />
            ) : (
              <Router isMainPage={isMainPage} initRouter={route} />
            )}
            <MountGlobalModal />
          </BaseLayout>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    );
  }, [isDarkMode, isMainPage, lang, params, route]);
};

export default memo(EnhanceCopyTradingProvider);
