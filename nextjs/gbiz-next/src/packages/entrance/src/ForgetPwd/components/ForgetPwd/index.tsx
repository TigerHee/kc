import { ThemeProvider, Snackbar, Notification } from '@kux/mui';
import { Alert } from '@kux/design';
import Layout from '../../../Layout';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { ForgetPwdStoreProvider, useForgetPwdStore } from '../../model';
import { Back } from './Back';
import InputAccount from './InputAccount';
import { useLang } from '../../../hookTool';
import ErrorBoundary, { SCENE_MAP } from '../../../components/ErrorBoundary';
import { getTenantConfig } from '../../../config/tenant';
import ResetPwd from './ResetPwd';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;
const { withLayout } = Layout;

interface IForgetPwdCompProps {
  inDrawer?: boolean;
  titleClassName?: string;
  onSuccess: () => void;
  onBack: () => void;
}

export type IForgetPwdProps = IForgetPwdCompProps &  { theme?: 'light' | 'dark' }

function ForgetPwd(props: IForgetPwdCompProps) {
  const { onSuccess, titleClassName = '', onBack, inDrawer = false } = props;
  const { t } = useLang();
  const [isResetPassword, setIsResetPassword] = useState(false);
  const resetInit = useForgetPwdStore(state => state.resetInit);
  const pullUser = useForgetPwdStore(state => state.pullUser);

  const handleBack = () => {
    if (isResetPassword) {
      setIsResetPassword(false);
    } else {
      onBack?.();
    }
  }

  const handleAccountEnter = () => {
    setIsResetPassword(true);
  };

  useEffect(() => {
    pullUser?.();
  }, [])

  useEffect(() => {
    return () => {
      resetInit?.();
    };
  }, []);

  return (
    <div className={clsx(styles.contentBox, inDrawer ? styles.inDrawer : null)} data-inspector="forget_pwd_container">
      <Back onBack={handleBack} />
      <h3 className={clsx(styles.title, inDrawer ? styles.inDrawer : null, titleClassName)}>
        {t('jDxAEXC2T4hpidJXV6Guyv')}
      </h3>
      <div className={styles.alertWrapper}>
        <Alert
          className={styles.alert}
          type="warning"
          duration={0}
          message={getTenantConfig().forgetPwd.alertText(t)}
        />
      </div>
      {isResetPassword ? (
        <ErrorBoundary scene={SCENE_MAP.forgetPwd.resetPwd}>
          <ResetPwd onSuccess={onSuccess} onBack={handleBack} />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary scene={SCENE_MAP.forgetPwd.inputAccount}>
          <InputAccount onSuccess={handleAccountEnter} onBack={handleBack} />
        </ErrorBoundary>
      )}
    </div>
  );
}

function WithProviderForgetPwd({ theme = 'light', ...props }: IForgetPwdProps) {
  return (
    <ErrorBoundary scene={SCENE_MAP.forgetPwd.index}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <NotificationProvider>
            <ForgetPwdStoreProvider>
              <ForgetPwd {...props} />
            </ForgetPwdStoreProvider>
          </NotificationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default withLayout(WithProviderForgetPwd);
