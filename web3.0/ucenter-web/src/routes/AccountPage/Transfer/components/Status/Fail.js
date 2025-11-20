/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { ICCloseOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { addLangToPath, _t } from 'src/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import siteCfg from 'utils/siteConfig';
import { resetAppHeader } from '../../utils/app';
import { getOriginSiteType, getTargetSiteType } from '../../utils/site';
import Benefits from './BenefitsItem';
import { CustomButton, LottieIcon, SubTitle, Title, Wrapper } from './style';

const emails = {
  global: 'support@kucoin.com',
  australia: 'help@kucoin.com',
  europe: 'support@kucoin.eu',
};

const FailWrap = styled(Wrapper)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: 44px 16px 0;
    margin-top: ${({ isApp }) => (isApp ? '84px' : '44px')};
  }
`;

const CloseBox = styled(ICCloseOutlined)`
  position: absolute;
  cursor: pointer;
  top: -16px;
  right: 0px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: -26px;
  }
`;

/**
 * 迁移失败
 */
export default function RemoteFail({ retry }) {
  const targetSiteType = useSelector((state) =>
    getTargetSiteType(state.userTransfer?.userTransferInfo, state.userTransfer?.userTransferStatus),
  );
  const originalSiteType = getOriginSiteType();
  const targetSiteName = getSiteName(targetSiteType);
  const isApp = JsBridge.isApp();
  const handleClick = () => {
    const { KUCOIN_HOST } = siteCfg;
    const link = addLangToPath(`${KUCOIN_HOST}/support`);
    if (isApp) {
      resetAppHeader();
      window.location.href = link;
    } else {
      window.open(link);
    }
  };

  useEffect(() => {
    kcsensorsManualExpose(
      ['intoFailurePage', '1'],
      {
        user_target_siteType: targetSiteType,
      },
      'account_transfer_result',
    );
  }, []);

  return (
    <FailWrap isApp={isApp}>
      <CloseBox
        onClick={() => {
          if (isApp) {
            JsBridge.open({
              type: 'func',
              params: { name: 'exit' },
            });
          } else {
            window.location.href = addLangToPath('/');
          }
          trackClick(['buttonExitMigration', 'exitMigrationButton3'], {
            user_target_siteType: targetSiteType,
          });
        }}
      />

      <LottieIcon iconName="error" />
      <Title>{_t('45d534dd5ab14800aedd')}</Title>
      <SubTitle>{_t('d8dc183ab6194000a870', { targetSiteName })}</SubTitle>
      <Benefits
        title={_t('c1e94f572e2b4000aea9')}
        items={[
          _t('70048ea572454800afc9'),
          _t('0f37d810d4904000a0d9'),
          _t('8f01b04018514800ac1f'),
          _t('741c7d7400044800a1b6'),
        ]}
      />
      <Footer>
        <FooterText style={{ marginBottom: 8 }}>
          {_t('89312b9755844000a29a')} <Email>{emails[originalSiteType]}</Email>
        </FooterText>
        <FooterText>{_t('59e8f8c2911d4000a472')}</FooterText>
        <Desc>{_t('333230faa3c24800ac4f')}</Desc>
      </Footer>
      <CustomButton
        onClick={(e) => {
          retry(e);
          trackClick(['buttonRemigrate', 'remigrateButton2'], {
            user_target_siteType: targetSiteType,
          });
        }}
      >
        {_t('41229845ea884800a87e')}
      </CustomButton>
      <CustomButton
        type="default"
        style={{ marginTop: 16 }}
        onClick={(e) => {
          handleClick(e);
          trackClick(['buttonConectCustomer', 'customerButton1'], {
            user_target_siteType: targetSiteType,
          });
        }}
      >
        {_t('conflict.contact')}
      </CustomButton>
    </FailWrap>
  );
}

const Footer = styled.section`
  margin: 24px 0 32px;
`;

const FooterText = styled.div`
  font-size: 14px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text60};
  text-align: center;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const Desc = styled(FooterText)`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.text40};
`;

const Email = styled.span`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
`;
