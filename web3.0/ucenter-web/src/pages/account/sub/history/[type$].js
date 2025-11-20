/**
 * Owner: tiger@kupotech.com
 */

import History from 'routes/AccountPage/SubAccount/History';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default (props) => {
  const Page = withMultiSiteForbiddenPage(
    History,
    'accountConfig',
    'supportSubAccount',
    '/account',
  );
  return <Page {...props} pageCode="history" />;
};
