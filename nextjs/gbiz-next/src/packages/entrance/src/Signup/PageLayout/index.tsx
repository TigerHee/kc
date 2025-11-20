/**
 * Owner: sean.shi@kupotech.com
 */
import useIsMobile from '../../hooks/useIsMobile';
import clsx from 'clsx';
import { useCompliantShow } from 'packages/compliantCenter';
import { InviterCard, InviteBenefits, SignupBenefits } from '../Benefits';
import { FusionSignUp, FusionSignUpProps } from '../FusionSignUp';
import { NoSSG } from '../../common/tools';
import { HEADER_MARKETING_SPM } from '../../common/constants';
import { getTenantConfig } from '../../config/tenant';
import { useLang } from '../../hookTool';
import { InviterState, useSignupStore } from '../model';
import styles from './index.module.scss';
import commonStyles from '../index.module.scss';

export {
  type FusionSignUpProps,
  FusionSignUp,
}

export type SignupPageLayoutProps = FusionSignUpProps & {
  inviterInfo?: InviterState['data'];
  showMktContent?: boolean;
}

export const SignupPageLayout = ({
  inviterInfo: inviterInfoProps,
  showMktContent,
  ...signProps
}: SignupPageLayoutProps) => {
  const { t } = useLang();
  const isH5 = useIsMobile();
  const { needCenter } = getTenantConfig().signup;
  const inviter = useSignupStore(state => state.inviter.data);
  const inviterInfo = inviterInfoProps || inviter;

  // 邀请者注册福利 模块
  const showRewards = useCompliantShow(HEADER_MARKETING_SPM); // follow Nav 上福利中心的入口元素的展业规则

  // 有邀请者信息（toB 合伙人或经纪商）才展示福利 && 展业屏蔽，follow 导航栏福利中心入口
  const showInviteBenefits = inviterInfo && showRewards;

  return (
    <div className={clsx(styles.regPageWrapper, needCenter && styles.needCenter)}>
      {isH5 || needCenter ? null : (
        <div className={styles.regPageLeftWrapper} data-inspector="signup_left_area">
          {/* 有邀请者信息，则展示邀请者信息 */}
          <NoSSG>
            <InviterCard inviterInfo={inviterInfo} />
            {showInviteBenefits ? (
              <InviteBenefits inviterInfo={inviterInfo} />
            ) : (
              <SignupBenefits showMktContent={showMktContent} />
            )}
          </NoSSG>
        </div>
      )}
      <div className={styles.regPageRightWrapper}>
        {/* h5 都在右侧 */}
        {isH5 ? (
          <>
            {inviterInfo && <h2 className={commonStyles.setAccountTitle}>{t('2e2b938c53714000a8fd')}</h2>}
            <InviterCard inviterInfo={inviterInfo} />
          </>
        ) : null}
        <FusionSignUp
          noLayout
          kycGuideWithDialog
          {...signProps}
          // 因命中合规不展示左侧内容时不需要请求邀请人信息
          showInviterInfo={!needCenter}
        />
        {!isH5 ? null : showInviteBenefits ? (
          <InviteBenefits inviterInfo={inviterInfo} />
        ) : null}
      </div>
    </div>
  );
};
