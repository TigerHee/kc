/**
 * Owner: willen@kupotech.com
 */
import { SignupPageLayout } from '@kucoin-gbiz-next/entrance';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { useTheme } from '@kux/mui';
import { memo } from 'react';
import { useSelector } from 'react-redux';

const SignUpLayout = memo((props) => {
  const { showMktContent, rcode, ...signProps } = props;
  const theme = useTheme();
  const categories = useSelector((s) => s.categories);

  const { data: inviterInfo } = useSelector((state) => state['$entrance_signUp']?.inviter ?? {});

  const { multiSiteConfig } = useMultiSiteConfig();

  // 没有接口多租户配置，则不展示
  if (!multiSiteConfig) {
    return null;
  }

  return (
    <SignupPageLayout
      inviterInfo={inviterInfo}
      showMktContent={showMktContent}
      categories={categories}
      kycGuideWithDialog
      theme={theme.currentTheme}
      {...signProps}
      multiSiteConfig={multiSiteConfig}
    />
  );
});
export default SignUpLayout;
