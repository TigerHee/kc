/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICAuthenticationOutlined, ICVerificationOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import faceidIcon from 'static/account/kyc/kyc3/ic2_faceid.svg';
import { _t } from 'tools/i18n';

const VerifyInfoBox = styled.div`
  background-color: ${({ theme }) => theme.colors.cover2};
  border-radius: 16px;
  padding: 24px;
  line-height: 21px;
  margin-top: 16px;
`;

const VerifyInfoTip = styled.div`
  color: ${({ theme }) => theme.colors.text40};
`;

const VerifyItem = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  margin-top: 12px;
  [class$='_svg__icon'] {
    margin-right: 8px;
    font-size: 18px;
  }
`;

const ExtendIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;
`;

export default function TRVerifyInfo({ children }) {
  return (
    <VerifyInfoBox>
      <VerifyInfoTip>{_t('6cb1fe21dd844000a51f')}</VerifyInfoTip>
      <VerifyItem>
        <ICAuthenticationOutlined />
        {_t('6jRRR6sAzWZT5ceQxwoGQY')}
      </VerifyItem>
      <VerifyItem>
        <ICVerificationOutlined />
        {_t('261c9e942dfb4000a9b2')}
      </VerifyItem>
      <VerifyItem>
        <ExtendIcon src={faceidIcon} />
        {_t('90bfc4fa0e384000a018')}
      </VerifyItem>
      {children}
    </VerifyInfoBox>
  );
}
