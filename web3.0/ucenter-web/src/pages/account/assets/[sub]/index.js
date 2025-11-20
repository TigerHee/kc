/**
 * Owner: tiger@kupotech.com
 */
import { withRouter } from 'components/Router';
import { useEffect } from 'react';
import Assets from 'routes/AssetsPage/SubAccount';
import { useAB } from 'src/routes/AssetsPage/utils';
import { replace } from 'utils/router';

function SubAccountPage({ query }) {
  const type = useAB('new');
  useEffect(() => {
    if (type !== 'new') {
      replace(`/account-sub/assets/${query?.sub}`);
    }
  }, [type]);
  return <Assets />;
}

export default withRouter()(SubAccountPage);
