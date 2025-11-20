/**
 * Owner: vijay.zhou@kupotech.com
 * 加载 kyc 各站点的 model
 * 除主站外，其他共享站的 model 不会主动加载
 */
import { getDvaApp } from '@/tools/dva/client';
import { useEffect, useState } from 'react';
import { tenantConfig } from 'src/config/tenant';

export default () => {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const dvaApp = getDvaApp();
    const _model = dvaApp._models.find((m) => m.namespace === tenantConfig.kyc.namespace);
    if (!_model) {
      import(`src/__models/account/${tenantConfig.kyc.namespace}`)
        .then(({ default: model }) => {
          dvaApp.model(model);
          setModel(model);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setModel(_model);
      setLoading(false);
    }
  }, []);

  return { loading, model };
};
