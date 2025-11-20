import {
  ICCustomerServiceOutlined,
  ICNoviceGuideOutlined,
  ICSecuritySettingOutlined,
} from '@kux/icons';
import { Box, Button, useTheme } from '@kux/mui';
import { showDateTimeByZone } from 'helper';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ResidenceDialog from 'src/components/Account/Kyc/ResidenceDialog/index.js';
import { addLangToPath, _t } from 'src/tools/i18n';
import ClearanceDarkIcon from 'static/account/kyc/brandUpgrade/kycStatus/clearance.dark.png';
import ClearanceIcon from 'static/account/kyc/brandUpgrade/kycStatus/clearance.png';
import rejectedDarkIcon from 'static/account/kyc/brandUpgrade/kycStatus/rejected.dark.png';
import rejectedIcon from 'static/account/kyc/brandUpgrade/kycStatus/rejected.png';
import verifiedDarkIcon from 'static/account/kyc/brandUpgrade/kycStatus/verified.dark.png';
import verifiedIcon from 'static/account/kyc/brandUpgrade/kycStatus/verified.png';
import VerifyingDarkIcon from 'static/account/kyc/brandUpgrade/kycStatus/verifying.dark.png';
import VerifyingIcon from 'static/account/kyc/brandUpgrade/kycStatus/verifying.png';
import useKyc3Status from '../../../../../KycHome/site/KC/hooks/useKyc3Status';
import {
  ColumnBox,
  Container,
  Desc,
  Divider,
  FailedList,
  HelpItem,
  Icon,
  RowBox,
  Title,
} from './styled';
import { push } from '@/utils/router';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const Verifying = ({ isDark, isH5 }) => {
  return (
    <Container gap={isH5 ? 32 : 40}>
      <ColumnBox gap={isH5 ? 16 : 20}>
        <ColumnBox gap={isH5 ? 0 : 8}>
          <Icon src={isDark ? VerifyingDarkIcon : VerifyingIcon} />
          <Title>{_t('aa73d295784f4000ac75')}</Title>
          {isH5 ? <Box size={8} /> : null}
          <Desc>{_t('104d7aa891ce4000a5cb')}</Desc>
        </ColumnBox>
        <Divider />
        <Desc small>{_t('3f656c14fef84800a319')}</Desc>
      </ColumnBox>
      <Button size="large" style={{ minWidth: 240 }} onClick={() => push('/')}>
        {_t('0b10a9c5454b4000afda')}
      </Button>
    </Container>
  );
};

const Verified = ({ isDark, isH5, onDeposit }) => {
  const kycInfo = useSelector((s) => s.kyc.kycInfo);
  const user = useSelector((state) => state.user.user);
  const { isDisplay: residenceIsShow } = useSelector((state) => state.kyc?.residenceConfig ?? {});
  const [residenceOpen, setResidenceOpen] = useState(false);

  const infoList = [
    {
      label: _t('name'),
      value: `${kycInfo?.firstName || ''} ${kycInfo?.lastName || ''}`,
    },
    {
      label: _t('c03122c2e1874000aa3a'),
      value: kycInfo?.birthday || '-',
    },
    {
      label: _t('f08397bed5e64000a76c'),
      value: `${kycInfo?.identityTypeDesc ? `${kycInfo?.identityTypeDesc}, ` : ''}${
        kycInfo?.identityNumber || ''
      }`,
    },
    {
      label: user?.email ? _t('iDWAuLLQhR4DzXSKETcgFL') : _t('peSc7tgoujgXJTCNeeAZkR'), // 展示邮箱或者手机
      value: user?.email ? user?.email : user?.phone,
    },
    {
      label: _t('identity.country'),
      value: (
        <>
          {residenceIsShow ? (
            <span className="infoEdit" onClick={() => setResidenceOpen(true)}>
              {_t('2411da0975f04800a412')}
            </span>
          ) : null}
          <span>{kycInfo?.regionName}</span>
        </>
      ),
    },
  ];

  return (
    <Container gap={32}>
      <ColumnBox gap={isH5 ? 32 : 40}>
        <ColumnBox gap={isH5 ? 0 : 8}>
          <Icon src={isDark ? verifiedDarkIcon : verifiedIcon} />
          <Title>{_t('62bdeb6055554800a2c6')}</Title>
          {isH5 ? <Box size={8} /> : null}
          <Desc>{_t('27e2560267cb4000a7c5')}</Desc>
        </ColumnBox>
        <Button size="large" fullWidth={!isH5} style={{ width: 240 }} onClick={onDeposit}>
          {_t('5eb06d178a384800a162')}
        </Button>
      </ColumnBox>
      <Divider />
      <ColumnBox gap={4} style={{ marginBottom: 48 }}>
        <div className="infoHeader">
          <div className="infoHeaderLabel">{_t('6jRRR6sAzWZT5ceQxwoGQY')}</div>
          <div
            onClick={() => {
              push('/account/kyc/update');
            }}
            className="infoEdit"
          >
            {_t('885e29ab7b614800abb2')}
          </div>
        </div>
        {infoList.map((item) => {
          const { label, value } = item;

          return (
            <div className="infoItem" key={value}>
              <div className="infoLabel">{label}</div>
              <div className="infoValue">{value}</div>
            </div>
          );
        })}
      </ColumnBox>
      <Desc small style={{ fontSize: 13 }}>
        <ICSecuritySettingOutlined size={16} />
        <span>{_t('a76c5d0f51924800af18')}</span>
      </Desc>

      <ResidenceDialog open={residenceOpen} onCancel={() => setResidenceOpen(false)} />
    </Container>
  );
};

const Rejected = ({ isDark, isH5, failedList, onRetry, onToWeb3 }) => {
  return (
    <Container gap={32}>
      <ColumnBox gap={isH5 ? 32 : 40}>
        <ColumnBox gap={isH5 ? 0 : 8}>
          <Icon src={isDark ? rejectedDarkIcon : rejectedIcon} />
          <Title>{_t('f2b667e733954800a64e')}</Title>
          {isH5 ? <Box size={8} /> : null}
          <FailedList onlyOne={failedList.length <= 1}>
            {failedList.map((info) => (
              <li key={info}>{info}</li>
            ))}
          </FailedList>
        </ColumnBox>
        <ColumnBox gap={20}>
          <Button size="large" fullWidth onClick={onRetry}>
            {_t('205f4884ec904800a1c2')}
          </Button>
          <Button size="large" fullWidth type="default" onClick={onToWeb3}>
            {_t('86a45476219d4000a4de')}
          </Button>
        </ColumnBox>
      </ColumnBox>
      <RowBox gap={24}>
        <HelpItem href={addLangToPath('/support/360015102254')}>
          <ICCustomerServiceOutlined size={16} />
          <span>{_t('fc8d5acef7c34800a73c')}</span>
        </HelpItem>
        <HelpItem href={addLangToPath('/support/app/help?source=kyc')}>
          <ICNoviceGuideOutlined size={16} />
          <span>{_t('b4510587b44b4800a7fc')}</span>
        </HelpItem>
      </RowBox>
    </Container>
  );
};

const Clearance = ({ isDark, isH5, theme, onRetry }) => {
  const kycClearInfo = useSelector((s) => s.kyc?.kycClearInfo);
  return (
    <Container gap={isH5 ? 20 : 24}>
      <ColumnBox gap={isH5 ? 32 : 40}>
        <ColumnBox gap={isH5 ? 0 : 8}>
          <Icon src={isDark ? ClearanceDarkIcon : ClearanceIcon} />
          <Title>{_t('357ee00594794000a8ae')}</Title>
          {isH5 ? <Box size={8} /> : null}
          <Desc style={{ color: theme.colors.secondary }}>
            {kycClearInfo.msg ? (
              <span>
                {kycClearInfo.msg.replace(
                  /\{t}/g,
                  kycClearInfo?.clearAt
                    ? showDateTimeByZone(kycClearInfo?.clearAt, 'YYYY/MM/DD HH:mm:ss', 0)
                    : '--',
                )}
              </span>
            ) : (
              <span>{_t('488f60435e0b4800afb5')}</span>
            )}
          </Desc>
        </ColumnBox>
        <Button size="large" fullWidth onClick={onRetry}>
          {_t('mwdwXUvagzZaLxv8oYUZLr')}
        </Button>
      </ColumnBox>
      <Desc small style={{ fontSize: 13 }}>
        <ICSecuritySettingOutlined size={16} />
        <span>{_t('a76c5d0f51924800af18')}</span>
      </Desc>
    </Container>
  );
};

const StatusCard = ({ onDeposit, onRetry, onToWeb3 }) => {
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const { failureReasonLists = [] } = useSelector((state) => state.kyc?.kycInfo ?? {});
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;

  switch (kyc3Status) {
    case kyc3StatusEnum.VERIFYING:
    case kyc3StatusEnum.FAKE:
      return <Verifying isDark={isDark} isH5={isH5} />;
    case kyc3StatusEnum.REJECTED:
      return (
        <Rejected
          isDark={isDark}
          isH5={isH5}
          failedList={failureReasonLists}
          onRetry={onRetry}
          onToWeb3={onToWeb3}
        />
      );
    case kyc3StatusEnum.VERIFIED:
      return <Verified isDark={isDark} isH5={isH5} onDeposit={onDeposit} />;
      break;
    case kyc3StatusEnum.CLEARANCE:
    case kyc3StatusEnum.RESET:
      return <Clearance isDark={isDark} isH5={isH5} theme={theme} onRetry={onRetry} />;
    default:
      return null;
  }
};

export default StatusCard;
