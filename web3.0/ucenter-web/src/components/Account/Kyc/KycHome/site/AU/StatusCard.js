/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined, ICSecuritySettingOutlined } from '@kux/icons';
import { styled, Tag as OriginTag, useResponsive, useTheme } from '@kux/mui';
import BaseCard from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Description';
import { _t } from 'src/tools/i18n';
import kyc_unverified from 'static/account/kyc/kyc3/kyc_unverified.png';
import kyc_unverified_dark from 'static/account/kyc/kyc3/kyc_unverified_dark.svg';
import kyc_verified_dark from 'static/account/kyc/kyc3/safe-dark.png';
import kyc_verified_light from 'static/account/kyc/kyc3/safe-light.png';
import Back from '../../../common/components/Back';
import FAQ from './FAQ';
import {
  Container,
  ExBaseTitle,
  ExButton,
  Header,
  Layout,
  LayoutLeft,
  LayoutRight,
  VerifyRegion,
} from './styled';

const Tag = styled(OriginTag)`
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
  padding: 4px 9px;
  border-radius: 39px;
  margin-left: 12px;
  .ICSecuritySetting_svg__icon {
    margin-right: 4px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 12px;
    margin-left: 0;
  }
`;
const Description = styled(BaseDescription)`
  font-size: 18px;
  line-height: 140%;
`;

const Icon = styled.img`
  pointer-events: none;
  user-select: none;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`;

const VerifiedIcon = ({ theme }) => {
  return <Icon src={theme === 'light' ? kyc_verified_light : kyc_verified_dark} size={140} />;
};

const UnVerifiedIcon = ({ theme }) => {
  return <Icon src={theme === 'light' ? kyc_unverified : kyc_unverified_dark} size={130} />;
};

/** @deprecated 仅用于澳洲站，澳洲站品牌升级后会弃用 */
export default function StatusCard({
  inspectorId,
  regionIcon,
  regionName,
  completed = false,
  completedTitle = '',
  completedBtnText,
  onCompletedBtnClick,
  slot,
  back = true,
  onBack,
}) {
  const rv = useResponsive();
  const theme = useTheme();

  const isH5 = !rv?.sm;

  return (
    <Container data-inspector={inspectorId}>
      {back ? <Back onClick={onBack} /> : null}
      <Header>
        {_t('kyc.certification.personal')}
        <VerifyRegion>
          <div>{_t('0418ee48e1824800ade2')}</div>
          <div>
            <img src={regionIcon} alt="icon" />
            {regionName}
          </div>
        </VerifyRegion>
      </Header>
      <Layout>
        <LayoutLeft>
          <BaseCard
            className="topBox"
            leftSlot={
              completed ? (
                <>
                  <ExBaseTitle>
                    <span>{completedTitle}</span>
                    <Tag>
                      <ICSecuritySettingOutlined size={16} />
                      <span>{_t('460cb69b03104000a1fc')}</span>
                    </Tag>
                  </ExBaseTitle>
                  {!isH5 ? <Description>{_t('fff91a6b38b04000acfe')}</Description> : null}
                  <ExButton size="large" variant="outlined" onClick={onCompletedBtnClick}>
                    <span>{completedBtnText}</span>
                    <ICArrowRight2Outlined size={16} />
                  </ExButton>
                </>
              ) : !isH5 ? (
                <>
                  <ExBaseTitle>{_t('e57ddb4efda64000afda')}</ExBaseTitle>
                  <BaseDescription>{_t('cec6aaeae1334000a197')}</BaseDescription>
                </>
              ) : null
            }
            rightSlot={
              completed ? (
                <VerifiedIcon theme={theme.currentTheme} />
              ) : !isH5 ? (
                <UnVerifiedIcon theme={theme.currentTheme} />
              ) : null
            }
            bottomSlot={slot}
          />
        </LayoutLeft>
        <LayoutRight>
          <FAQ />
        </LayoutRight>
      </Layout>
    </Container>
  );
}
