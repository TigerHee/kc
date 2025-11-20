/**
 * Owner: willen@kupotech.com
 */
import { ICEmailSendOutlined } from '@kux/icons';
import { Divider, styled, useTheme } from '@kux/mui';
import AbsoluteLoading from 'components/AbsoluteLoading';
import { withRouter } from 'components/Router';
import { useCallback } from 'react';
import { connect } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import AccountLayout from '@/components/AccountLayout';

const ActivationWrapper = styled.section`
  padding: 16px;
`;

const LastTitle = styled.h2`
  margin-top: 16px;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  font-weight: normal;
  font-size: 36px;
  line-height: 1;
`;

const LastDesc = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  line-height: 1.25;

  span {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const TipsTitle = styled.h6`
  margin: 0;
  margin-top: 12px;
  color: ${(props) => props.theme.colors.text60};
  font-weight: normal;
  font-size: 14px;
  line-height: 1.4;
`;

const TipsSection = styled.section`
  margin: 0;
  margin-top: 12px;
  color: ${(props) => props.theme.colors.text60};
  font-weight: normal;
  font-size: 14px;
  line-height: 1.4;

  p {
    margin: 0;
    margin-bottom: 4px;

    span {
      color: ${(props) => props.theme.colors.primary};
      cursor: pointer;
    }

    span:hover {
      opacity: 0.8;
    }
  }
  .retryIn {
    span {
      span {
        color: ${(props) => props.theme.colors.text60};
        cursor: auto;
      }

      span:hover {
        opacity: 1;
      }
    }
  }
`;

const Activation = (props) => {
  const { dispatch, loading, user, query = {} } = props || {};
  const emailLoading = loading.effects['api_key/sendActivationEmail'];
  const theme = useTheme();

  const retry = useCallback(
    (e) => {
      const { target } = e;
      if (target && !emailLoading) {
        const nowClick = target.getAttribute('name') || '';
        if (nowClick && nowClick === 'retry') {
          // 发送激活邮件
          dispatch({
            type: 'api_key/sendActivationEmail',
            payload: { apiKey: query?.apiKey },
          });
        }
      }
    },
    [dispatch, emailLoading, query],
  );

  return (
    <AccountLayout>
      <ActivationWrapper data-inspector="api_activation_page">
        <ICEmailSendOutlined color={theme.colors.icon} size={84} />
        <LastTitle>{_t('api.manage.last')}</LastTitle>
        <LastDesc>{_tHTML('api.manage.already', { email: user?.email || '' })}</LastDesc>
        <Divider />
        <TipsTitle>{_t('api.manage.email.no')}</TipsTitle>
        <TipsSection>
          <p>{_t('api.manage.tips1')}</p>
          <p>{_t('api.manage.tips2')}</p>
          <p onClick={retry} className={emailLoading ? 'retryIn' : ''}>
            {_tHTML('api.manage.tips3')}
          </p>
        </TipsSection>
        {emailLoading ? <AbsoluteLoading /> : null}
      </ActivationWrapper>
    </AccountLayout>
  );
};

export default withRouter()(
  connect(({ user, loading }) => ({
    user: user.user,
    loading,
  }))(Activation),
);
