import { toast } from '@kux/design';
import { useEffect, useState } from 'react';
import { pullResetToken } from 'src/services/ucenter/reset-security';
import ResetSecurity from '../ResetSecurity';
import ExLoading from '../ResetSecurity/components/ExLoading';

export default function ResetSecurityWithAddress({ address }) {
  const [token, setToken] = useState(null);

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
