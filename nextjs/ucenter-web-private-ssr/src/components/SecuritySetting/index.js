/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { ICInfoFilled, ICSuccessFilled } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { Link } from 'components/Router';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import { useRouter } from 'kc-next/router';

const IconSize = 16;

const Security = styled.div``;

const Content = styled.div`
  width: 100%;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.overlay};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 28px 24px;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
    font-size: 14px;
  }
`;
const Container = styled.div`
  .alertItem {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 14px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    .statusIcon {
      height: 20px;
      margin-right: 8px;
    }
    a {
      margin-left: 8px;
      color: ${({ theme }) => theme.colors.primary};
    }
    &:first-child {
      margin-top: 0;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 12px;
    }
  }
`;

const SecuritySetting = ({ tip, needTwiceProtect = true, needEmail = false, ...otherProps }) => {
  useLocale();
  const theme = useTheme();
  const WarningColor = theme.colors.text;
  const SuccessColor = theme.colors.primary;
  const router = useRouter();
  const {
    user: { isSub = false },
    securtyStatus: security,
  } = useSelector((state) => state.user);

  let isTwiceProtect = security.GOOGLE2FA || security.SMS;
  let message1 = 'active.sms.g2fa.verify';
  let link1 = '/account/security/g2fa';
  if (isSub) {
    isTwiceProtect = security.GOOGLE2FA && (security.SMS || security.EMAIL);
    message1 = 'sub.active.verify';
    link1 = '/account/security';
  }
  const isWithDrawProtect = security.WITHDRAW_PASSWORD;
  const isEmail = security.EMAIL;
  return (
    <Security {...otherProps}>
      <Content>
        <Title>{tip}</Title>
        <Container>
          {needTwiceProtect && (
            <div className="alertItem">
              {isTwiceProtect ? (
                <ICSuccessFilled className="mr-8" size={IconSize} color={SuccessColor} />
              ) : (
                <ICInfoFilled className="mr-8" size={IconSize} color={WarningColor} />
              )}
              {_t(message1)}
              {isTwiceProtect ? null : (
                <Link
                  dontGoWithHref
                  to={link1}
                  onClick={() => {
                    router?.push(link1);
                  }}
                >
                  {_t('go.setting')}
                </Link>
              )}
            </div>
          )}
          <div className="alertItem">
            {isWithDrawProtect ? (
              <ICSuccessFilled className="mr-8" size={IconSize} color={SuccessColor} />
            ) : (
              <ICInfoFilled className="mr-8" size={IconSize} color={WarningColor} />
            )}
            {_t('set.trade.code')}
            {isWithDrawProtect ? null : (
              <Link
                dontGoWithHref
                to="/account/security/protect"
                onClick={() => {
                  router?.push(link1);
                }}
              >
                {_t('go.setting')}
              </Link>
            )}
          </div>
          {needEmail && !isSub ? (
            <div className="alertItem">
              {isEmail ? (
                <ICSuccessFilled className="mr-8" size={IconSize} color={SuccessColor} />
              ) : (
                <ICInfoFilled className="mr-8" size={IconSize} color={WarningColor} />
              )}
              {isEmail ? _t('api.manage.bind.already') : _t('api.manage.bind')}
              {isEmail ? null : (
                <Link
                  dontGoWithHref
                  to="/account/security/email"
                  onClick={() => {
                    router?.push(link1);
                  }}
                >
                  {_t('api.manage.bind.to')}
                </Link>
              )}
            </div>
          ) : null}
        </Container>
      </Content>
    </Security>
  );
};

export default SecuritySetting;
