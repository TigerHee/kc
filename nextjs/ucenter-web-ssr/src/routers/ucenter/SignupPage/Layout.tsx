// import { LottiePlayer } from '@kux/design';
import useTheme from '@/hooks/useTheme';
import { SignupPageLayout } from 'gbiz-next/entrance';
import Link from '@/components/Router/Link';
import useTranslation from '@/hooks/useTranslation';
import styles from './styles.module.scss';
import { getUrlSearch } from '@/utils/searchToJson';
import { kcsensorsClick } from '@/core/telemetryModule';
import { getTenantConfig } from '@/tenant';
import { useQueryParams } from '@/components/Entrance/hookTool';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';
import { SIGN_UP_BTN_TEXT_KEY } from './config';
import bonus from './img/bonus_light.png';
import bonusDark from './img/bonus_dark.png';
import { useMemo } from 'react';
import { useUserStore } from '@/store/user';

const ForgetLeft = () => {
  const { Trans } = useTranslation();
  const handleClickLogin = () => {
    kcsensorsClick(['LogIn', '1'], {
      before_click_element_value: '',
      after_click_element_value: 'Log in',
    });
  };
  return (
    <div className={styles.forgetLeft}>
      <Link
        data-inspector="signup_had_account_btn"
        className={styles.fastText}
        to={`/ucenter/signin${getUrlSearch()}`}
        onClick={handleClickLogin}
      >
        <Trans i18nKey="already.had.account" components={{ a: <a /> }} />
      </Link>
    </div>
  );
};

export function SignupLayout(props) {
  const { showMktContent, ...signProps } = props;
  const theme = useTheme();
  const { t: _t } = useTranslation();
  const { signUpType, ignoreKycCheck, rcode } = useQueryParams();

  const updateInviteInfo = useUserStore((state) => state.updateInviteInfo);

  const singUpBtnText = useMemo(() => {
    let _text = '';
    if (getTenantConfig().signup.isBtnUseDefaultText) {
      return _t('69e2446aaf9e4000a105'); // 本地站都用素文案
    }
    if (signUpType) {
      const _key = SIGN_UP_BTN_TEXT_KEY(_t)[signUpType];
      if (_key) {
        _text = typeof _key === 'function' ? _key() : _key; // 自定义文案
      }
    } else {
      if (!showMktContent) {
        _text = _t('69e2446aaf9e4000a105');
      }
    }
    return _text;
  }, [signUpType, showMktContent]);

  return (
    <div data-inspector="signup_page" className={styles.page}>
      <ErrorBoundary scene={SCENE_MAP.signup.signupLayoutGbiz}>
        <SignupPageLayout
          singUpBtnText={singUpBtnText}
          showMktContent={showMktContent}
          ignoreKycCheck={ignoreKycCheck}
          onUpdateInviter={updateInviteInfo}
          kycGuideWithDialog
          theme={theme.theme}
          forgetLeft={<ForgetLeft />}
          agreeJSX={_t('term.user.agree')}
          rcode={rcode}
          bonusImg={
            showMktContent && getTenantConfig().signup.isShowMktContent ? (
              <img
                alt="bonus"
                className={styles.lottiePlayer}
                src={theme.theme === 'light' ? bonus : bonusDark}
              />
            ) : null
          }
          {...signProps}
        />
      </ErrorBoundary>
    </div>
  );
}
