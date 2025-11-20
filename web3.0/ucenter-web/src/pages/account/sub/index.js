/**
 * Owner: tiger@kupotech.com
 */
import SubAccount from 'routes/AccountPage/SubAccount';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';

export default () => {
  const Page = withMultiSiteForbiddenPage(
    SubAccount,
    'accountConfig',
    'supportSubAccount',
    '/account',
  );
  return <Page />;
};
