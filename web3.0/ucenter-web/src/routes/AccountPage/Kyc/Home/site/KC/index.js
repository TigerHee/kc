/**
 * Owner: vijay.zhou@kupotech.com
 */
import history from '@kucoin-base/history';
import { Alert, Button } from '@kux/mui';
import { withRouter } from 'components/Router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLangToPath, _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import storage from 'src/utils/storage';
import { isTMA } from 'src/utils/tma/bridge';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import { push, replace } from 'utils/router';
import Back from '../../../components/Back';
import useKyc3Status from '../../../KycHome/site/KC/hooks/useKyc3Status';
import usePIStatus from '../../../KycHome/site/KC/hooks/usePIStatus';
import replaceWithBackUrl from '../../../utils/replaceWithBackUrl';
import useIsPI from '../../hooks/useIsPI';
import OcrResult from './components/OcrResult';
import PIStatusCard from './components/PIStatusCard';
import StatusCard from './components/StatusCard';
import { AlertWrapper, Container, Wrapper } from './components/styled';
import { KYC_ACCOUNT_TRANSFER_TIPS } from './constants';

function KycHome({ query }) {
  const dispatch = useDispatch();
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const { PIStatusEnum, PIStatus } = usePIStatus();
  const { regionCode } = useSelector((state) => state.kyc?.kycInfo ?? {});
  const { ocr, kycClearInfo, canTransferInfo } = useSelector((state) => state.kyc ?? {});
  const isPI = useIsPI({ regionCode });
  const userInfo = useSelector((s) => s.user?.user);

  // 只要用户不是审核中/已通过/假失败，就可以任意提交KYC/KYB
  const isCannotSwitchType = [
    kyc3StatusEnum.VERIFYING,
    kyc3StatusEnum.VERIFIED,
    kyc3StatusEnum.FAKE,
  ].includes(kyc3Status);

  const isBasicClearance = [kyc3StatusEnum.CLEARANCE, kyc3StatusEnum.RESET].includes(kyc3Status);
  const isPIVerified = PIStatus === PIStatusEnum.VERIFIED;
  const targetSiteType = canTransferInfo?.targetSiteType || '';
  const originalSiteType = window._BRAND_SITE_FULL_NAME_?.toLowerCase?.() || '';

  /* 有kyc提交记录不显示切换 */
  const hiddenRightSwitch = isCannotSwitchType || isTMA();
  const targetSiteName = getSiteName(targetSiteType);

  const handleBack = () => {
    dispatch({ type: 'kyc/update', payload: { kycRedirect: false } });
    push('/account/kyc');
  };

  const handleRetry = async () => {
    if (kycClearInfo?.clearStatus === 1) {
      await dispatch({ type: 'kyc/updateClearInfo' });
    }
    replaceWithBackUrl('/account/kyc/setup/country-of-issue', query.backUrl);
  };

  const handleToWeb3 = () => push(addLangToPath('/web3'));

  const handleDeposit = () => {
    window.location.href = addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`);
  };

  useEffect(() => {
    if ([kyc3StatusEnum.UNVERIFIED, kyc3StatusEnum.SUSPEND].includes(kyc3Status)) {
      replace('/account/kyc');
    }
  }, [kyc3Status, kyc3StatusEnum]);

  const [showTransferTips, setShowTransferTips] = useState(false);

  const goAccountTransfer = () => {
    trackClick(['buttonMigrateImmediately', '1'], {
      user_original_siteType: originalSiteType,
      user_target_siteType: targetSiteType,
    });
    history.push('/account/transfer');
  };

  useEffect(() => {
    // 获取用户是否可迁移信息
    dispatch({ type: 'kyc/getUserTransferInfo' });
    dispatch({ type: 'kyc/pullResidenceConfig' });

    return () => dispatch({ type: 'kyc/update', payload: { ocr: { query: false } } });
  }, []);

  useEffect(() => {
    const canTransfer = canTransferInfo?.transferSwitchMap?.['KYC'] ?? canTransferInfo?.canTransfer;
    if (canTransfer) {
      // 检查用户迁移是否可见, 一次登录仅查一次
      const lastLoginTime = +storage.getItem(KYC_ACCOUNT_TRANSFER_TIPS);
      if (+userInfo.lastLoginAt !== lastLoginTime) {
        setShowTransferTips(true);
      }
    }
  }, [canTransferInfo?.canTransfer]);

  useEffect(() => {
    if (kyc3Status) {
      kcsensorsManualExpose(['resultPage', '1'], {
        status: kyc3Status,
      });
    }
  }, [kyc3Status]);

  return (
    <Container data-inspector="account_kyc_personal_homepage">
      {ocr?.query ? (
        <OcrResult />
      ) : (
        <>
          {showTransferTips ? (
            <AlertWrapper>
              <Alert
                showIcon
                type="warning"
                closable
                title={
                  <>
                    <span>{_t('271f5f1dfd7d4000a37b', { targetSiteName })}</span>
                    <Button size="mini" variant="outlined" onClick={goAccountTransfer}>
                      <span>{_t('0e5612829fed4800a0b7')}</span>
                    </Button>
                  </>
                }
                onClose={() => {
                  storage.setItem(KYC_ACCOUNT_TRANSFER_TIPS, userInfo?.lastLoginAt);
                  setShowTransferTips(false);
                }}
              />
            </AlertWrapper>
          ) : null}
          <Wrapper hasBack={!hiddenRightSwitch} isPI={isPI}>
            {hiddenRightSwitch ? null : <Back onBack={handleBack} />}
            {isPI && !isBasicClearance && !isPIVerified ? (
              <PIStatusCard
                status={kyc3Status}
                onDeposit={handleDeposit}
                onRetry={handleRetry}
                onToWeb3={handleToWeb3}
              />
            ) : (
              <StatusCard
                status={kyc3Status}
                onDeposit={handleDeposit}
                onRetry={handleRetry}
                onToWeb3={handleToWeb3}
              />
            )}
          </Wrapper>
        </>
      )}
    </Container>
  );
}

export default withRouter()(KycHome);
