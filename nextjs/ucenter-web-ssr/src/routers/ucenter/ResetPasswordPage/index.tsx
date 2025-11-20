import styles from './styles.module.scss';
import {
  useBackground,
  useBackgroundDark,
} from '@/components/Entrance/hookTool';
import useTheme from '@/hooks/useTheme';
import { ForgetPwd } from 'gbiz-next/entrance';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';
import { useLoginJump } from '@/hooks/useLoginJump';

export default function ResetPasswordPage(props) {
  const backgroundProps = useBackground();
  const backgroundPropsDark = useBackgroundDark();

  const { theme } = useTheme();
  const { LayoutSlots } = ForgetPwd;
  const { BackgroundStyle } = LayoutSlots;

  useLoginJump();

  return (
    <div data-inspector="reset_password_page" className={styles.page}>
      <ErrorBoundary scene={SCENE_MAP.resetPassword.resetPasswordGbiz}>
        <ForgetPwd theme={theme} {...props}>
          <LayoutSlots>
            <BackgroundStyle>
              {theme === 'dark' ? backgroundPropsDark : backgroundProps}
            </BackgroundStyle>
          </LayoutSlots>
        </ForgetPwd>
      </ErrorBoundary>
    </div>
  );
}
