/**
 * Owner: tiger@kupotech.com
 */
import { withRouter } from 'components/Router';
import { useEffect } from 'react';
import AssetsLegacy from 'routes/AssetsPage/SubAccountLegacy';
import { useAB } from 'src/routes/AssetsPage/utils';
import { replace } from 'utils/router';

function SubAccountPage({ query }) {
  const type = useAB('legacy');
  useEffect(() => {
    if (type !== 'legacy') {
      replace(`/account/assets/${query?.sub}`);
    }
  }, [type]);
  return <AssetsLegacy />;
}

export default withRouter()(SubAccountPage);
