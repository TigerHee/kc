/**
 * Owner: jessie@kupotech.com
 */
import { Divider, styled } from '@kux/mui';
import AbsoluteLoading from 'components/AbsoluteLoading';
import { withRouter } from 'components/Router';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import verifySvg from '@/static/api/Verify.svg';
import { _t, _tHTML } from 'tools/i18n';
import AccountLayout from '@/components/AccountLayout';

const VerifyWrapper = styled.section`
  padding: 16px;
`;

const EmailIcon = styled.img`
  width: 90px;
  height: 80px;
  margin-bottom: 40px;
`;

const LastTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 28px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 24px;
  line-height: 31px;
`;

const LastDesc = styled.span`
  display: block;
  margin-bottom: 12px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  span {
    span {
      color: #24ae8f;
    }
  }
`;

const LightDesc = styled.span`
  color: rgba(0, 13, 29, 0.4);
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
`;

const CusDivider = styled(Divider)`
  margin: 32px 0;
`;

const TipsTitle = styled.h6`
  margin: 0 0 6px 0;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
`;

const TipsSection = styled.section`
  margin: 0 0 6px 0;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  p {
    margin: 0;
    margin-bottom: 4px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    span {
      span {
        color: ${(props) => props.theme.colors.primary};
        cursor: pointer;
      }

      span:hover {
        opacity: 0.8;
      }
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

const Verify = ({ query }) => {
  const { verifyId } = query;
  const dispatch = useDispatch();
  const emailLoading = useSelector((state) => state.loading.effects['api_key/sendVerifyEmail']);
  const user = useSelector((state) => state.user.user);
  const retry = useCallback(
    (e) => {
      const { target } = e;
      if (target && !emailLoading) {
        const nowClick = target.getAttribute('name') || '';
        if (nowClick && nowClick === 'retry') {
          // 发送激活邮件
          dispatch({
            type: 'api_key/sendVerifyEmail',
            payload: { verifyId },
          });
        }
      }
    },
    [dispatch, emailLoading, verifyId],
  );

  return (
    <AccountLayout>
      <VerifyWrapper data-inspector="verify_api_email">
        <EmailIcon src={verifySvg} alt="verify" />
        <LastTitle>{_t('dsEKFd7gvcBuzoBxRzYgjy')}</LastTitle>
        <LastDesc>{_tHTML('sf4dZ4KDkHeL393TySFeyy', { email: user?.email || '' })}</LastDesc>
        <LightDesc>{_t('m4cSNQWFL44oG437WQxYdu')}</LightDesc>
        <CusDivider />
        <TipsTitle>{_t('tbwBxMfKUErKCK44V6yGzD')}</TipsTitle>
        <TipsSection>
          <p>{_t('idKkZCbTXuTWgGAwt54AZg')}</p>
          <p>{_t('hwYFVmjzjQdDvegjuMSGSC')}</p>
          <p onClick={retry} className={emailLoading ? 'retryIn' : ''}>
            {_tHTML('9ZF87j4KXpUYBZHR8dE4iz')}
          </p>
        </TipsSection>
        {emailLoading ? <AbsoluteLoading /> : null}
      </VerifyWrapper>
    </AccountLayout>
  );
};

export default withRouter()(Verify);
