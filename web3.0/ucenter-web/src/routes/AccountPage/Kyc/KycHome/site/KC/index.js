/**
 * Owner: lena@kupotech.com
 */
import history from '@kucoin-base/history';
import { ICMechanismOutlined } from '@kux/icons';
import { Spin, styled, useResponsive } from '@kux/mui';
import { getKycLevel } from 'components/Account/Kyc/KycHome/config';
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getSiteName from 'src/utils/getSiteName';
import storage from 'src/utils/storage';
import { ReactComponent as ArrowRightIcon } from 'static/account/kyc/index/arrow_right.svg';
import { ReactComponent as AlertWarnIcon } from 'static/account/transfer/alert-warn.svg';
import { ReactComponent as TransferCloseIcon } from 'static/account/transfer/transfer_close.svg';
import { _t } from 'tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import { isTMA } from 'utils/tma/bridge';
import {
  Description,
  KYC3Wrapper,
  MainLayout,
  MainLeftBox,
  MainRightBox,
  TopLayout,
  TopLeftBox,
  TopLeftTitle,
  TransferButton,
  TransferTipsContent,
  TransferTipsLayout,
} from '../../components/commonUIs';
import FAQ from '../../components/FAQ';
import AccountLimits from './components/AccountLimits';
import KycStatusCard from './components/KycStatusCard';
import { KYC_ACCOUNT_TRANSFER_TIPS } from './constants';
import useClickVerify from './hooks/useClickVerify';
import useKyc3Status from './hooks/useKyc3Status';

const TopRightBox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const KYBIcon = styled(ICMechanismOutlined)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.text};
  @media screen and (max-width: 767px) {
    width: 16px;
    height: 16px;
  }
`;
const KYBDesc = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 2px 0 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const ArrowIcon = styled(ArrowRightIcon)`
  width: 16px;
  height: 16px;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

const AlertIcon = styled(AlertWarnIcon)`
  position: absolute;
  left: 16px;
  top: 16px;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 12px;
    left: 12px;
  }
`;

const CloseIcon = styled(TransferCloseIcon)`
  position: absolute;
  right: 16px;
  top: 20px;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 12px;
    right: 12px;
  }
`;

const Kyc3Home = ({ triggerType }) => {
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const dispatch = useDispatch();
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const userInfo = useSelector((s) => s.user?.user);

  const loading = useSelector((s) => s.loading);
  const {
    kycInfo,
    kyc_id_photo_catch_type,
    financeListKYC,
    autoOpenKycModal,
    isKYCModalOpen,
    canTransferInfo,
  } = useSelector((state) => state.kyc);
  const [currentRoute, setCurrentRoute] = useState('app');
  const [backUrl, setBackUrl] = useState('');
  const [showTransferTips, setShowTransferTips] = useState(false);
  const [query, setQuery] = useState({});
  const { from = '', type, backurl } = query;

  const targetSiteType = canTransferInfo?.targetSiteType || '';
  const originalSiteType = window._BRAND_SITE_FULL_NAME_?.toLowerCase?.() || '';

  const setShowModal = (v) => {
    dispatch({
      type: 'kyc/update',
      payload: { isKYCModalOpen: v },
    });
  };

  const goAccountTransfer = () => {
    trackClick(['buttonMigrateImmediately', '1'], {
      user_original_siteType: originalSiteType,
      user_target_siteType: targetSiteType,
    });
    history.push('/account/transfer');
  };

  const { onClickVerify } = useClickVerify({ setCurrentRoute, setShowModal });

  const openKycModalRef = useRef(autoOpenKycModal);
  // 保存国家证件并拉取最新信息的 loading
  const kycInfoLoading =
    loading.effects['kyc/pullKycInfo'] || loading.effects['kyc/postCountryAndIdentity'];
  useEffect(() => {
    // 从选择个人/机构主页进来时，需要自动唤起 kyc 弹窗
    // 当 kyc3Status 不为 null 才代表初始化完成，可以唤起
    if (!kycInfoLoading && openKycModalRef.current && kyc3Status !== null) {
      onClickVerify();
      openKycModalRef.current = false;
    }
  }, [kycInfoLoading, kyc3Status]);

  const isShowPI = useMemo(() => {
    return financeListKYC?.length > 0;
  }, [financeListKYC]);

  const kycLevel = useMemo(() => {
    return (
      getKycLevel(kycInfo) || { btnText: _t('ujZc9hLkSmYHhQy4CQHo6u'), level: 0, showBtn: true }
    );
  }, [kycInfo]);

  useEffect(() => {
    dispatch({ type: 'kyc/getPrivileges' });
    // 获取kyc福利信息
    dispatch({ type: 'kyc/getKYC3RewardInfo' });
    // 获取用户是否可迁移信息
    dispatch({ type: 'kyc/getUserTransferInfo' });
  }, []);

  useEffect(() => {
    const queryStr = window.location.search?.split('?')[1];
    const _query = {};
    if (queryStr) {
      const queryArr = queryStr.split('&') || [];
      queryArr.map((item) => {
        const itemArr = item.split('=');
        const key = itemArr[0];
        const val = itemArr[1];
        _query[key] = val;
      });
    }
    setQuery(_query);
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
    if (backurl) {
      let _backurl = backurl;
      if (!backurl.includes('https://')) {
        _backurl = `https://${backurl}`;
      }
      if (window._CHECK_BACK_URL_IS_SAFE_(_backurl)) {
        setBackUrl(_backurl);
      }
    }
  }, [backurl]);

  useEffect(() => {
    if (from === 'advanceResult') {
      setShowModal(true);
      setCurrentRoute(type === 'success' ? 'countdown' : 'kyc1');
    }
    if (from === 'legoAdvanceResult') {
      setShowModal(true);
      setCurrentRoute('result');
      try {
        kcsensorsManualExpose(
          [],
          {
            apply_kyc_level: 'kyc1',
            current_kyc_level:
              kycLevel?.level === 0 ? 'kyc0' : kycLevel?.level === 1 ? 'kyc1' : 'kyc2',
            kyc_country_type:
              kycInfo?.regionType === 1
                ? '1OT'
                : kycInfo?.regionType === 2
                ? '2OT'
                : kycInfo?.regionType === 3
                ? 'normal'
                : 'unkonw',
            kyc_channel: 'web_lego',
            kyc_submit_result: 'success',
            kyc_id_photo_front_catch_type: kyc_id_photo_catch_type,
            kyc_id_photo_back_catch_type: kyc_id_photo_catch_type,
            kyc_liveness_catch_type: 'screen',
            kyc_submit_terminal: isH5 ? 'web_mobile' : 'web_pc',
          },
          'kyc_submit_result',
        );
      } catch (error) {}
    }
  }, [from, type, isH5]);

  // 没有kyc信息
  const isKycInfoEmpty = useMemo(() => isEmpty(kycInfo), [kycInfo]);
  const isPageLoading = useMemo(() => {
    return isKycInfoEmpty || loading.effects['kyc/pullFinanceList'];
  }, [isKycInfoEmpty, loading.effects]);

  // 只要用户不是审核中/已通过/假失败，就可以任意提交KYC/KYB
  const isCannotSwitchType = [
    kyc3StatusEnum.VERIFYING,
    kyc3StatusEnum.VERIFIED,
    kyc3StatusEnum.FAKE,
  ].includes(kyc3Status);

  /* 有kyc提交记录不显示切换 */
  const hiddenRightSwitch = isCannotSwitchType || isTMA();
  const targetSiteName = getSiteName(targetSiteType);

  return (
    <Spin spinning={Boolean(isPageLoading)} size="small">
      <KYC3Wrapper id="kyc">
        <TopLayout>
          <TopLeftBox>
            <TopLeftTitle>{_t('wa7D3en7SMk3FAsjMavo6M')}</TopLeftTitle>
          </TopLeftBox>
          {hiddenRightSwitch ? null : (
            <TopRightBox className="kyc_home_trigger_btn" onClick={triggerType}>
              <KYBIcon />
              <KYBDesc>{_t('2tDn1oYBdzHNdG5Hp2kTYh')}</KYBDesc>
              <ArrowIcon />
            </TopRightBox>
          )}
        </TopLayout>

        {showTransferTips && (
          <TransferTipsLayout>
            <TransferTipsContent>
              <AlertIcon />
              <Description>{_t('271f5f1dfd7d4000a37b', { targetSiteName })}</Description>
              <TransferButton variant="outlined" onClick={goAccountTransfer}>
                <span>{_t('0e5612829fed4800a0b7')}</span>
              </TransferButton>
            </TransferTipsContent>
            <CloseIcon
              onClick={() => {
                storage.setItem(KYC_ACCOUNT_TRANSFER_TIPS, userInfo?.lastLoginAt);
                setShowTransferTips(false);
              }}
            />
          </TransferTipsLayout>
        )}

        <MainLayout>
          <MainLeftBox>
            <KycStatusCard onClickVerify={onClickVerify} />
            {isShowPI ? null : <AccountLimits />}
          </MainLeftBox>
          <MainRightBox>
            <FAQ />
          </MainRightBox>
        </MainLayout>
      </KYC3Wrapper>
    </Spin>
  );
};

export default Kyc3Home;
