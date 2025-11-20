/**
 * Owner: eli.xiang@kupotech.com
 */
import { styled, keyframes, useTheme } from '@kux/mui';
import { useMemo } from 'react';
import { useTranslation } from '@tools/i18n';
import { PasskeyLoginStatus } from '../../../hookTool/usePasskeyLogin';
import PasskeyLoginIcon from '../../../../static/login_passkey.svg';
import PasskeyLoginDarkIcon from '../../../../static/login_passkey_dark.svg';
import LoadingIcon from '../../../../static/loading.svg';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const PasskeyLoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PasskeyErrorSpan = styled.span`
  font-size: 14px;
  line-height: 18px;
  color: #f65454;
  margin-top: 8px;
`;

const LoginButton = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  font-size: 16px;
  color: ${({ isFetching, theme }) => {
    return isFetching ? theme.colors.text40 : theme.colors.text;
  }};
  font-feature-settings: 'liga' off, 'clig' off;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  padding: 0 30px;
  cursor: pointer;
  overflow: hidden;
  font-weight: 500;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    height: 40px;
    img {
      width: 16px;
      height: 16px;
    }
  }
`;

const AnimationIcon = styled.img`
  display: ${({ show }) => (show ? 'block' : 'none')};
  animation: ${({ animation }) => (animation ? `${spin} 1s linear infinite` : 'none')};
`;

export default function PasskeyLoginBtn({ disabled, passkeyLoginStatus, handleClick }) {
  const { t: _t } = useTranslation('entrance');
  const { currentTheme } = useTheme();

  const isFetching = disabled || passkeyLoginStatus === PasskeyLoginStatus.LOADING;

  const btnText = useMemo(() => {
    const StatusText = {
      [PasskeyLoginStatus.READY]: '169e42f96d5c4000ad0f', // 169e42f96d5c4000ad0f
      [PasskeyLoginStatus.LOADING]: '40f398319a6c4000a4c6', // 40f398319a6c4000a4c6
      [PasskeyLoginStatus.SUCCESS]: '169e42f96d5c4000ad0f',
      [PasskeyLoginStatus.ERROR]: '3d925cab7a9c4000ae24', // 3d925cab7a9c4000ae24
    };
    return _t(StatusText[passkeyLoginStatus]);
  }, [passkeyLoginStatus, _t]);

  const handleOnClick = () => {
    if (isFetching) {
      return;
    }
    handleClick();
  };

  return (
    <PasskeyLoginBox data-inspector="login_passkey_btn">
      <LoginButton id="login_passkey_btn" isFetching={isFetching} onClick={handleOnClick}>
        <AnimationIcon
          show={passkeyLoginStatus === PasskeyLoginStatus.LOADING}
          animation
          src={LoadingIcon}
          alt="passkey-login-icon"
        />
        <AnimationIcon
          show={passkeyLoginStatus !== PasskeyLoginStatus.LOADING}
          animation={false}
          src={currentTheme === 'light' ? PasskeyLoginIcon : PasskeyLoginDarkIcon}
          alt="passkey-login-icon"
        />
        {btnText}
      </LoginButton>
      {passkeyLoginStatus === PasskeyLoginStatus.ERROR ? (
        <PasskeyErrorSpan>{_t('91befce0aba74000a9bc')}</PasskeyErrorSpan>
      ) : null}
    </PasskeyLoginBox>
  );
}
