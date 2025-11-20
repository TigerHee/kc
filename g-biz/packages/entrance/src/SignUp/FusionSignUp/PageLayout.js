/**
 * Owner: sean.shi@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { useCompliantShow } from '@packages/compliantCenter';
import { InviterCard, InviteBenefits, SignupBenefits } from '../Benefits';
import { RegPageWrapper, RegPageLeftWrapper, RegPageRightWrapper, SetAccountTitle } from './styled';
import FusionSignUp from './index';
import { NoSSG } from '../../common/tools';
import { HEADER_MARKETING_SPM } from '../../common/constants';
import { tenantConfig } from '../../config/tenant';
import { useLang } from '../../hookTool';

export const SignupPageLayout = ({
  theme,
  inviterInfo,
  showMktContent,
  categories,
  ...signProps
}) => {
  const responsive = useResponsive();
  const { t } = useLang();
  const isH5 = !responsive.sm;
  const { needCenter } = tenantConfig.signup;
  // 邀请者注册福利 模块
  const showRewards = useCompliantShow(HEADER_MARKETING_SPM); // follow Nav 上福利中心的入口元素的展业规则

  // 有邀请者信息（toB 合伙人或经纪商）才展示福利 && 展业屏蔽，follow 导航栏福利中心入口
  const showInviteBenefits = inviterInfo && showRewards;
  return (
    <RegPageWrapper needCenter={needCenter}>
      {isH5 || needCenter ? null : (
        <RegPageLeftWrapper data-inspector="signup_left_area">
          {/* 有邀请者信息，则展示邀请者信息 */}
          <NoSSG>
            <InviterCard inviterInfo={inviterInfo} />
            {showInviteBenefits ? (
              <InviteBenefits inviterInfo={inviterInfo} />
            ) : (
              <SignupBenefits showMktContent={showMktContent} categories={categories} />
            )}
          </NoSSG>
        </RegPageLeftWrapper>
      )}
      <RegPageRightWrapper>
        {/* h5 都在右侧 */}
        {isH5 ? (
          <>
            {inviterInfo && <SetAccountTitle>{t('2e2b938c53714000a8fd')}</SetAccountTitle>}
            <InviterCard inviterInfo={inviterInfo} />
          </>
        ) : null}
        <FusionSignUp
          noLayout
          kycGuideWithDialog
          setAccountTitle={null}
          theme={theme.currentTheme}
          {...signProps}
          // 因命中合规不展示左侧内容时不需要请求邀请人信息
          showInviterInfo={!needCenter}
        />
        {!isH5 ? null : showInviteBenefits && <InviteBenefits inviterInfo={inviterInfo} />}
      </RegPageRightWrapper>
    </RegPageWrapper>
  );
};
