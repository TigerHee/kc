/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Box } from '@kux/mui';
import { isIOS } from 'helper';
import { useEffect } from 'react';
import ErrorBoundary, { SCENE_MAP } from 'src/components/common/ErrorBoundary';
import { exitSelfContainer } from 'src/utils/runInApp';
import { push } from 'utils/router';
import RemoteForgetPwd from './RemoteForgetPwd';

const gotoSignin = () => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    if (isIOS()) {
      exitSelfContainer();
    } else {
      JsBridge.open({
        type: 'func',
        params: { name: 'exit' },
      });
    }
  } else {
    push('/ucenter/signin');
  }
};

export default () => {
  useEffect(() => {
    if (JsBridge.isApp()) {
      /** 关闭 app loading 蒙层 */
      JsBridge.open({
        type: 'func',
        params: {
          name: 'onPageMount',
          dclTime: window.DCLTIME,
          pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
        },
      });
    }
  }, []);

  return (
    <Box width="100%" style={{ height: '100%' }}>
      <ErrorBoundary scene={SCENE_MAP.forgetPwd.index}>
        <RemoteForgetPwd onSuccess={gotoSignin} onBack={gotoSignin} />
      </ErrorBoundary>
    </Box>
  );
};
