/**
 * Owner: sean.shi@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useMemo } from 'react';
import { PasskeyLoginStatus, useLang } from '../../../../hookTool';
import PasskeyLoginIcon from '../../../../../static/login_passkey.svg';
import PasskeyLoginDarkIcon from '../../../../../static/login_passkey_dark.svg';
import LoadingIcon from '../../../../../static/loading.svg';
import styles from './index.module.scss';
import clsx from 'clsx';

interface PasskeyLoginBtnProps {
  disabled?: boolean;
  passkeyLoginStatus: typeof PasskeyLoginStatus[keyof typeof PasskeyLoginStatus];
  handleClick: () => void;
}

export default function PasskeyLoginBtn({ disabled, handleClick, passkeyLoginStatus }: PasskeyLoginBtnProps) {
  const { t: _t } = useLang();
  const { currentTheme } = useTheme();

  const isFetching = disabled || passkeyLoginStatus === PasskeyLoginStatus.LOADING;

  const btnText = useMemo(() => {
    const StatusText = (t) => ({
      [PasskeyLoginStatus.READY]: t('169e42f96d5c4000ad0f'),
      [PasskeyLoginStatus.LOADING]: t('40f398319a6c4000a4c6'),
      [PasskeyLoginStatus.SUCCESS]: t('169e42f96d5c4000ad0f'),
      [PasskeyLoginStatus.ERROR]: t('3d925cab7a9c4000ae24'),
    });
    return StatusText(_t)[passkeyLoginStatus];
  }, [passkeyLoginStatus, _t]);

  const handleOnClick = () => {
    if (isFetching) {
      return;
    }
    handleClick();
  };

  return (
    <div className={styles.passkeyLoginBox} data-inspector="login_passkey_btn">
      <div
        id="login_passkey_btn"
        className={clsx(styles.loginButton, {
          [styles.loginButtonFetching]: isFetching,
        })}
        onClick={handleOnClick}
      >
        <img
          className={styles.animationIcon}
          style={{ display: passkeyLoginStatus === PasskeyLoginStatus.LOADING ? 'block' : 'none' }}
          src={LoadingIcon}
          alt="passkey-login-icon"
        />
        <img
          className={styles.animationIcon}
          style={{ display: passkeyLoginStatus !== PasskeyLoginStatus.LOADING ? 'block' : 'none' }}
          src={currentTheme === 'light' ? PasskeyLoginIcon : PasskeyLoginDarkIcon}
          alt="passkey-login-icon"
        />
        {btnText}
      </div>
      {passkeyLoginStatus === PasskeyLoginStatus.ERROR && (
        <span className={styles.passkeyErrorSpan}>{_t('91befce0aba74000a9bc')}</span>
      )}
    </div>
  );
}
