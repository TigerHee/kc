import {useEffect, useState} from 'react';
import {commonBridge, exitRN} from '@krn/bridge';
import {FallbackPage} from '@krn/ui';

import useLang from 'hooks/useLang';
import {compareVersion, getNativeInfo} from 'utils/helper';

const SUPPORT_RELOAD_VERSION = '3.89.0';

const ErrorPage = () => {
  const [supportReload, setSupportReload] = useState(false);
  const {_t} = useLang();

  // 判断下支持重装加载的app版本，支持再显示"重新加载"按钮
  useEffect(() => {
    (async () => {
      const {version} = await getNativeInfo();
      setSupportReload(
        !!commonBridge.reload &&
          compareVersion(version, SUPPORT_RELOAD_VERSION) >= 0,
      );
    })();
  }, []);

  return (
    <>
      <FallbackPage
        title={_t('qREhnkh1zSEfu8212CPrDi')}
        description={_t('cHsJjCFLoKmDoFf3AGCZPR')}
        buttonText={supportReload ? _t('cVJXma1JQzV4kX2K2ZifJc') : null}
        onPressBack={() => exitRN()}
        onPressButton={() => commonBridge.reload()}
      />
    </>
  );
};
export default ErrorPage;
