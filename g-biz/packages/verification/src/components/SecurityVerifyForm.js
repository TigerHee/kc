/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useEffect, useMemo, useState } from 'react';
import getPreVerifyResult from '../utils/getPreVerifyResult';
import InnerForm from './InnerForm';
import ErrorInfo from './ErrorInfo';
import plugins from '../plugins';
import withProvider from '../utils/withProvider';

function SecurityVerifyForm(props) {
  const { bizType, onSuccess } = props;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});
  const { error = null, transactionId = '', methods = [], token = '', needVerify = true } = result;
  const isSupported = useMemo(() => methods?.[0]?.length > 0 && methods[0].every(plugins.has), [
    methods,
  ]);

  useEffect(async () => {
    setLoading(true);
    setResult(await getPreVerifyResult(bizType));
    setLoading(false);
  }, [bizType]);

  useEffect(() => {
    if (!needVerify && token) {
      onSuccess(token);
    }
  }, [needVerify, token]);

  if (loading) {
    return null;
  }

  if (error || !isSupported) {
    return <ErrorInfo code={error?.code} />;
  }

  return (
    <InnerForm
      bizType={bizType}
      transactionId={transactionId}
      methods={methods}
      onSuccess={onSuccess}
    />
  );
}

export default withProvider(SecurityVerifyForm, {});
