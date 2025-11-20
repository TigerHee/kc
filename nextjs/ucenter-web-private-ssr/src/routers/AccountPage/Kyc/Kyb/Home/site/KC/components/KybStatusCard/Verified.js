/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { Box, Button, styled } from '@kux/mui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { bootConfig } from 'kc-next/boot';
import {
  COMPANY_TYPE_LIST,
  TOTAL_FIELDS,
  TOTAL_FIELD_INFOS,
} from 'routes/AccountPage/Kyc/config';
import BaseCard from 'routes/AccountPage/Kyc/Kyb/Home/components/Card';
import { addLangToPath, _t } from 'src/tools/i18n';
import illustrationIcon from 'static/account/kyc/kyb/illustration.svg';
import { trackClick } from 'utils/ga';
import useCountryName from '../../../../hooks/useCountryName';

const Container = styled.div`
  .KYBBaseTitle {
    margin-bottom: 8px;
  }
  .KYBBottomWrapper {
    margin-top: 28px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .KYBBaseCardWrapperTop {
      & > div:nth-of-type(1) {
        width: 100%;
      }
    }
    .KYBRightWrapper {
      align-self: center;
    }
  }
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    text-align: center;
  }
`;
const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin-top: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    text-align: center;
  }
`;
const ExButton = styled(Button)`
  padding: 11px 16px 11px 20px;
  display: flex;
  gap: 4px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-self: center;
  }
`;
const RightImg = styled.img`
  width: 160px;
  height: 160px;
  pointer-events: none;
  user-select: none;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 130px;
    height: 130px;
  }
`;

const CompanyInfo = styled.div`
  display: flex;
  padding: 20px 24px;
  flex-direction: column;
  gap: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  background: ${({ theme }) => theme.colors.cover2};
`;
const CompanyInfoItem = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  justify-content: space-between;
  > span:nth-child(even) {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Verified = () => {
  const { registrationCountry, companyType, name, code } = useSelector(
    (state) => state.kyb?.companyDetail ?? {},
  );

  // 是否入过金
  const recharged = useSelector((state) => state.user?.recharged);
  const rewardInfo = useSelector((s) => s.kyc?.rewardInfo);

  const rewardMessage = useMemo(() => {
    if (['DEPOSIT'].includes(rewardInfo?.taskType)) {
      return rewardInfo?.taskSubTitle;
    }
    return '';
  }, [rewardInfo]);

  const CountryName = useCountryName(registrationCountry);

  const companyTypeName = useMemo(() => {
    return COMPANY_TYPE_LIST().find((item) => item.value === companyType)?.title;
  }, [companyType]);

  const handleDeposit = () => {
    trackClick(['verifyPage', 'deposit']);
    window.location.href = addLangToPath(`/assets/coin/${bootConfig._BASE_CURRENCY_}`);
  };

  return (
    <Container>
      <BaseCard
        isShowPrivacy
        leftSlot={
          <>
            <Title>{_t('kyc_homepage_deposited')}</Title>
            <Desc>
              {recharged || !rewardMessage ? _t('kyc_homepage_deposited_default') : rewardMessage}
            </Desc>
            <Box size={28} />
            <ExButton onClick={handleDeposit}>
              {_t('kyc_homepage_deposited_button')}
              <ICArrowRight2Outlined />
            </ExButton>
          </>
        }
        rightSlot={<RightImg src={illustrationIcon} />}
        bottomSlot={
          <CompanyInfo>
            <CompanyInfoItem>
              <span>{TOTAL_FIELD_INFOS[TOTAL_FIELDS.name]?.title?.()}</span>
              <span>{name}</span>
            </CompanyInfoItem>
            <CompanyInfoItem>
              <span>{TOTAL_FIELD_INFOS[TOTAL_FIELDS.registrationCountry]?.title?.()}</span>
              <span>{CountryName}</span>
            </CompanyInfoItem>
            <CompanyInfoItem>
              <span>{TOTAL_FIELD_INFOS[TOTAL_FIELDS.code]?.title?.()}</span>
              <span>{code}</span>
            </CompanyInfoItem>
            <CompanyInfoItem>
              <span>{TOTAL_FIELD_INFOS[TOTAL_FIELDS.companyType]?.title?.()}</span>
              <span>{companyTypeName}</span>
            </CompanyInfoItem>
          </CompanyInfo>
        }
      />
    </Container>
  );
};

export default Verified;
