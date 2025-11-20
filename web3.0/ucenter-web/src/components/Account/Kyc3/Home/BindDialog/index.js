/**
 * Owner: tiger@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import emailIcon from 'static/account/kyc/kyc3/email_unverified.svg';
import phoneIcon from 'static/account/kyc/kyc3/phone_unverified.svg';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';

const ExDialog = styled(Dialog)`
  .KuxModalFooter-root {
    padding-top: 24px;
  }
`;
const PreAuthBox = styled.div`
  margin-top: 40px;
  text-align: center;
`;
const PreAuthIcon = styled.img`
  width: 100px;
  height: 100px;
  margin: 0 auto;
`;

const PreAuthTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 24px;
  line-height: 31px;
`;

const PreAuthDescription = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  line-height: 24px;
`;

export default ({ open, onCancel }) => {
  const { email } = useSelector((state) => state.user?.user ?? {});

  return (
    <ExDialog
      data-inspector="account_kyc_tr_bind_modal"
      header={null}
      open={open}
      cancelText={_t('05f87078c18d4000ae87')}
      onCancel={onCancel}
      okText={_t('ff9f2edf2b384000afc2')}
      onOk={() => {
        push(email ? '/account/security/phone' : '/account/security/email');
      }}
      centeredFooterButton
      showCloseX={false}
    >
      <PreAuthBox>
        <PreAuthIcon src={email ? phoneIcon : emailIcon} />
        <PreAuthTitle>
          {email ? _t('23c84fadda274000ae0f') : _t('0c217e4a4ace4000a800')}
        </PreAuthTitle>
        <PreAuthDescription>{_t('6658868a10bb4000a9ea')}</PreAuthDescription>
      </PreAuthBox>
    </ExDialog>
  );
};
