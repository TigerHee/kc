/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { COMPANY_TYPE_LIST } from 'src/routes/AccountPage/Kyc/config';
import useKybStatus from 'src/routes/AccountPage/Kyc/hooks/useKybStatus';
import { _t, _tHTML } from 'src/tools/i18n';
import { trackClick } from 'utils/ga';
import useCountryName from '../../../../hooks/useCountryName';
import PIWrapper from '../PIWrapper';
import Rejected from './Rejected';
import Unverified from './Unverified';
import Verified from './Verified';
import Verifying from './Verifying';

const TG_URL = 'https://t.me/KuCoin_Broker';

const Container = styled.div`
  padding: 32px 28px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 16px;
  }
`;
const CompanyName = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 26px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
    font-size: 18px;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 20px;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-size: 16px;
  }
`;
const Item = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  justify-content: space-between;
  & + & {
    margin-top: 8px;
  }
  > span:nth-child(even) {
    color: ${({ theme }) => theme.colors.text};
  }
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.divider8};
`;
const Divider2 = styled.div`
  color: ${({ theme }) => theme.colors.text30};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  gap: 16px;
  align-items: center;
  &:after,
  &:before {
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.divider8};
    content: '';
  }
`;

const TGVerify = styled.div`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  > a {
    color: ${({ theme }) => theme.colors.primary};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 12px;
    font-size: 14px;
  }
`;

const KybStatusCardInner = ({ desc, goVerify }) => {
  const { kybStatus, kybStatusEnum } = useKybStatus();
  switch (kybStatus) {
    case kybStatusEnum.UNVERIFIED:
      return <Unverified desc={desc} goVerify={goVerify} />;
    case kybStatusEnum.VERIFYING:
      return <Verifying desc={desc} />;
    case kybStatusEnum.REJECTED:
      return <Rejected desc={desc} goVerify={goVerify} />;
    default:
      return null;
  }
};

const KybStatusCard = ({ goVerify }) => {
  const { registrationCountry, companyType, name, code } = useSelector(
    (state) => state.kyb?.companyDetail ?? {},
  );
  const { kybStatus, kybStatusEnum, isProxySubmission } = useKybStatus();
  const financeListKYB = useSelector((s) => s.kyc.financeListKYB);

  const companyTypeName = useMemo(() => {
    return COMPANY_TYPE_LIST.find((item) => item.value === companyType)?.title;
  }, [companyType]);
  const countryName = useCountryName(registrationCountry, 'KYB');

  // 开启专业投资者流程
  const PIEnable =
    financeListKYB?.length > 0 && (!isProxySubmission || kybStatus === kybStatusEnum.VERIFIED);

  if (!PIEnable && kybStatus === kybStatusEnum.VERIFIED) {
    return <Verified />;
  }

  return (
    <Container>
      <CompanyName>{name || _t('fe8aaf6356a24000a342')}</CompanyName>
      <Content>
        <div>
          <Title>{_t('kyc.company.information')}</Title>
          <Item>
            <span>{_t('105535fc2eae4000afe5')}</span>
            <span>{countryName}</span>
          </Item>
          <Item>
            <span>{_t('kyc.company.code')}</span>
            <span>{code}</span>
          </Item>
          <Item>
            <span>{_t('1697d795cbef4800a8ad')}</span>
            <span>{companyTypeName}</span>
          </Item>
        </div>
        <Divider />
        <div>
          <Title>{_t('4fab65e77d6d4000a999')}</Title>
          {PIEnable ? (
            <PIWrapper identityStatus={<KybStatusCardInner desc goVerify={goVerify} />} />
          ) : (
            <KybStatusCardInner goVerify={goVerify} />
          )}
        </div>
        {!PIEnable ? (
          <>
            <Divider />
            <div>
              <Title>{_t('0e452c0484fe4000a7d5')}</Title>
              <Item>
                <span>{_t('deposit')}</span>
                <span>{_t('967eebf066114800acaa')}</span>
              </Item>
              <Item>
                <span>{_t('withdrawal')}</span>
                <span>{_t('b759c35a54154800a334')}</span>
              </Item>
            </div>
          </>
        ) : null}
        {kybStatus !== kybStatusEnum.VERIFYING ? (
          <div>
            <Divider2>{_t('7QSMua73QMovhgsX5NYgUc')}</Divider2>
            <TGVerify
              onClick={(e) => {
                if (e.target?.nodeName === 'A') {
                  trackClick(['TGGoVerify', '1']);
                }
              }}
            >
              {_tHTML('6390a83f455f4000a526', { url: TG_URL })}
            </TGVerify>
          </div>
        ) : null}
      </Content>
    </Container>
  );
};

export default KybStatusCard;
