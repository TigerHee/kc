import ResetSecurity from '../ResetSecurity';
import { withRouter } from 'components/Router';
import ExLoading from '../ResetSecurity/components/ExLoading';
import { useState, useEffect } from 'react';
import { toast } from '@kux/design';
import { pullResetToken } from 'services/ucenter/reset-security';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

function ResetSecurityWithAddress({ query }) {
  const [token, setToken] = useState(null);
  const { address } = query;

  const onRefreshToken = async () => {
    try {
      const { data } = await pullResetToken({ userAccount: address });
      setToken(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.msg || error?.message);
    }
  };

  useEffect(() => {
    onRefreshToken();
  }, [address]);

  return (
    <ExLoading loading={!token}>
      {token ? (
        <ResetSecurity token={token} address={address} onRefreshToken={onRefreshToken} />
      ) : null}
    </ExLoading>
  );
}


export default withRouter()(function(props) {
  return <ErrorBoundary scene={SCENE_MAP.resetSecurity.address}>
    <ResetSecurityWithAddress {...props} />
  </ErrorBoundary>;
});
