/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { ICEyeOpenOutlined, ICEyeCloseOutlined } from '@kux/icons';
import Spin from '@mui/Spin';
import Alert from '@mui/Alert';
import { _t } from 'src/utils/lang';
import { Link } from 'src/components/Router';
import TradePwd from '@/components/InputPwd';
import useTradePwd, {
  EXPIRATION_DATE,
  VERIFY_END_EVENT_NAME,
} from './useTradePwd';
import {
  Info,
  Content,
  PwdTitle,
  PwdError,
  Container,
  AlertTitle,
  Description,
  FlexContainer,
  ForgotPassword,
} from './style';

// 如果要区分来源，可以传source
const Verify = React.memo(({ source, isSimple, isModal = false, ...otherProps }) => {
  const {
    close,
    error,
    clearFlag,
    isVerifing,
    toggleClose,
    handleChange,
  } = useTradePwd({ source });

  if (isSimple) {
    return (
      <Container {...otherProps}>
        <Spin spinning={isVerifing}>
          <Content isSimple={isSimple}>
            <FlexContainer>
              <PwdTitle isSimple={isSimple}>
                {_t('duiYNG4GvWCcaUotYZcPWu')}
              </PwdTitle>
              <Description isSimple={isSimple}>
                {!close ? (
                  <ICEyeOpenOutlined
                    size={16}
                    onClick={toggleClose}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <ICEyeCloseOutlined
                    size={16}
                    onClick={toggleClose}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </Description>
            </FlexContainer>
            <TradePwd
              close={close}
              clearFlag={clearFlag}
              onChange={handleChange}
            />
            {error ? <PwdError>{error}</PwdError> : null}
          </Content>
        </Spin>
      </Container>
    );
  }

  return (
    <Container {...otherProps}>
      <Alert
        type={error ? 'error' : 'info'}
        title={
          <AlertTitle>
            {error || _t('aVmmpoUfam6EG2HUPm8Ezv')}
          </AlertTitle>
        }
      />
      <Spin spinning={isVerifing}>
        <Content isModal={isModal}>
          {!isModal ? <PwdTitle>{_t('duiYNG4GvWCcaUotYZcPWu')}</PwdTitle> : null}
          <div>
            <Description>
              <Info>{_t('dLyEC7ezaMZbouic4fiCht', { a: EXPIRATION_DATE })}</Info>
              {!close ? (
                <ICEyeOpenOutlined
                  onClick={toggleClose}
                  size={16}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <ICEyeCloseOutlined
                  onClick={toggleClose}
                  size={16}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </Description>
            <TradePwd
              clearFlag={clearFlag}
              close={close}
              onChange={handleChange}
            />
            <ForgotPassword>
              <Link to="/account/security/forgetWP" target="_target">
                {_t('trd.trade_password.forget.warning')}
              </Link>
            </ForgotPassword>
          </div>
        </Content>
      </Spin>
    </Container>
  );
});

export default Verify;
export { VERIFY_END_EVENT_NAME };
