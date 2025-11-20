/**
 * Owner: willen@kupotech.com
 */
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import Security from 'components/Account/Security/Home';
import withMultiSiteConfig from 'src/hocs/withMultiSiteConfig';
export default () => {
  const SecurityPage = withMultiSiteConfig(Security);
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.configPage}>
      <SecurityPage />
    </ErrorBoundary>
  );
};
