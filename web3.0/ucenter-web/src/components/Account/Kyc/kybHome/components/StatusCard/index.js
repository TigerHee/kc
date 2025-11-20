import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined, ICFailOutlined, ICHookOutlined } from '@kux/icons';
import { Tooltip, useResponsive, useTheme } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import warningIcon from 'static/account/kyc/kyc3/alert_warning.svg';
import kyc_verified_dark from 'static/account/kyc/kyc3/safe-dark.png';
import kyc_verified_light from 'static/account/kyc/kyc3/safe-light.png';
import { KYC_STATUS_ENUM } from '../../../../../../constants/kyc/enums';
import FailureReason from '../../../KycHome/FailureReason';
import {
  BenefitItem,
  Benefits,
  CollectInfoItem,
  CollectInfos,
  Container,
  Content,
  ContinueAlert,
  Desc,
  Divider,
  Divider2,
  ExButton,
  FailAlert,
  Header,
  Icon,
  Img,
  Layout,
  LayoutLeft,
  LayoutRight,
  Title,
} from './styled';

const KybStatusCard = ({
  status,
  failReasonList,
  regionName,
  companyName,
  benefits = [],
  collectInfos = [],
  loading,
  completedBtnText,
  onCompleted,
  onVerify,
}) => {
  const { isRTL } = useLocale();
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const isVerified = status === KYC_STATUS_ENUM.VERIFIED;

  const header = (
    <Header>
      <Title isEmpty={!companyName}>{companyName || _t('32ab883f8cdd4800a319')}</Title>
      <Desc>
        {_t('95a310fe1d754800a753')}&nbsp;
        {regionName}
      </Desc>
    </Header>
  );

  if (isVerified) {
    return (
      <Container>
        <Layout>
          <LayoutLeft>
            {header}
            {completedBtnText ? (
              <div>
                <ExButton onClick={onCompleted}>
                  <span>{completedBtnText}</span>
                  <ICArrowRight2Outlined size={16} />
                </ExButton>
              </div>
            ) : null}
          </LayoutLeft>
          <LayoutRight>
            <Img src={isDark ? kyc_verified_dark : kyc_verified_light} />
          </LayoutRight>
        </Layout>
      </Container>
    );
  }

  return (
    <Container>
      {header}
      <Divider />
      <Content>
        <Benefits>
          <div>{_t('5bb5a9598a064000ac7f')}</div>
          <div>
            {benefits.map((benefit) => (
              <BenefitItem key={benefit}>
                <ICHookOutlined size={isH5 ? 12 : 20} />
                {benefit}
              </BenefitItem>
            ))}
          </div>
        </Benefits>
        <Divider2 />

        <div>
          <Desc style={{ marginBottom: 12 }}>{_t('2493c86b6bbb4800a8fa')}</Desc>
          <CollectInfos isRTL={isRTL}>
            {collectInfos.map((info) => (
              <li key={info}>
                <CollectInfoItem>{info}</CollectInfoItem>
              </li>
            ))}
          </CollectInfos>
        </div>

        {status === KYC_STATUS_ENUM.SUSPEND ? (
          <ContinueAlert>
            <Icon src={warningIcon} />
            <span>{_t('917141689c944000ac18')}</span>
          </ContinueAlert>
        ) : null}
        {status === KYC_STATUS_ENUM.VERIFYING ? (
          <ContinueAlert>
            <Icon src={warningIcon} />
            <span>{_t('71673fa088544000a1eb')}</span>
          </ContinueAlert>
        ) : null}
        {status === KYC_STATUS_ENUM.REJECTED ? (
          <FailAlert>
            <ICFailOutlined />
            <div>
              <span>{_t('f2b667e733954800a64e')}</span>
              &nbsp;
              <Tooltip title={<FailureReason failureReasonLists={failReasonList} />}>
                <u>{_t('11795d4672934800a0ec')}</u>
              </Tooltip>
            </div>
          </FailAlert>
        ) : null}

        {[KYC_STATUS_ENUM.UNVERIFIED, KYC_STATUS_ENUM.SUSPEND, KYC_STATUS_ENUM.REJECTED].includes(
          status,
        ) ? (
          <div>
            <ExButton size="large" loading={loading} onClick={onVerify}>
              {status === KYC_STATUS_ENUM.UNVERIFIED ? (
                <span>{_t('320e5455d3384000a6c9')}</span>
              ) : status === KYC_STATUS_ENUM.SUSPEND ? (
                <span>{_t('c259d5c7e7dd4000a753')}</span>
              ) : status === KYC_STATUS_ENUM.REJECTED ? (
                <span>{_t('48a040550a384000af48')}</span>
              ) : null}
              <ICArrowRight2Outlined size={16} />
            </ExButton>
          </div>
        ) : null}
      </Content>
    </Container>
  );
};

export default KybStatusCard;
