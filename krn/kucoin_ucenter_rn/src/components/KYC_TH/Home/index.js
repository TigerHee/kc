import React, {memo, useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {openNative, showToast, trackBridge} from '@krn/bridge';
import {TouchableOpacity} from 'react-native';
import {VerifyPlaceholder} from './Placeholder';
import Privileges from './Privileges';
import {Rejected, Unverified, Verified, Verifying} from './VerifyArea';
import {kycStatusEnum} from './config';
import useKycStatus from './hooks/useKycStatus';
import useIconSrc from 'hooks/useIconSrc';
import {Drawer, Button} from '@krn/ui';
import {
  VerifyTipFooter,
  VerifyTipText,
  DrawerContent,
  UserTypeIcon,
  CloseBox,
  CloseIcon,
  BaseVerifyWrapper,
} from './style';
import {useNavigation} from '@react-navigation/native';
import useLang from 'hooks/useLang';
import {
  AdvanceUnverified,
  AdvanceVerifying,
  AdvanceRejected,
  AdvanceVerified,
} from './AdvanceStatus';
import {postAdvance} from 'services/kyc_th';
import {getNativeInfo, compareVersion} from 'utils/helper';
import useTracker from 'hooks/useTracker';

const {afTrack} = trackBridge;

export default memo(() => {
  const advanceStatusData = useSelector(s => s.kyc_th.advanceStatusData);
  const kycInfo = useSelector(s => s.kyc_th.kycInfo);
  const {
    isFirstLoading,
    status,
    failReason,
    advanceStatus,
    advVerifiedPending,
  } = useKycStatus();
  const {onClickTrack} = useTracker();

  const [show, setShow] = useState(false);
  const [isBtnLoading, setBtnLoading] = useState(false);
  const navigation = useNavigation();
  const {_t} = useLang();

  const onClickVerify = async () => {
    setShow(true);

    onClickTrack({
      blockId: 'identifyVerification',
      locationId: 'getVerifiedButton',
    });
    const {version} = await getNativeInfo();
    if (compareVersion(version, '3.138.0') >= 0) {
      afTrack('th_kyc_started_appsflyer');
    }
  };

  // 是否基础认证通过
  const isBaseVerified = useMemo(() => {
    return [kycStatusEnum.KYB_VERIFIED, kycStatusEnum.KYC_VERIFIED].includes(
      status,
    );
  }, [status]);

  // 是否advance认证通过
  const isAdvanceVerified = useMemo(() => {
    return [kycStatusEnum.ADVANCE_VERIFIED].includes(advanceStatus);
  }, [advanceStatus]);

  const renderStatus = () => {
    if (isAdvanceVerified) {
      return null;
    }
    // 1. 加载中
    if (isFirstLoading) {
      return <VerifyPlaceholder />;
    }
    // 2. 未认证
    if (status === kycStatusEnum.UNVERIFIED) {
      return <Unverified onClickVerify={onClickVerify} />;
    }
    // 3. 认证中
    if (
      [kycStatusEnum.KYC_VERIFYING, kycStatusEnum.KYB_VERIFYING].includes(
        status,
      )
    ) {
      return <Verifying isKyb={status === kycStatusEnum.KYB_VERIFYING} />;
    }
    // 4. 认证失败
    if (
      [kycStatusEnum.KYC_REJECTED, kycStatusEnum.KYB_REJECTED].includes(status)
    ) {
      return (
        <Rejected
          onClickVerify={onClickVerify}
          failReason={failReason}
          isKyb={status === kycStatusEnum.KYB_REJECTED}
        />
      );
    }
    // 5. 认证成功
    if (
      [kycStatusEnum.KYC_VERIFIED, kycStatusEnum.KYB_VERIFIED].includes(status)
    ) {
      return <Verified isKyb={status === kycStatusEnum.KYB_VERIFIED} />;
    }
  };

  const onStartAdvance = () => {
    setBtnLoading(true);
    postAdvance({
      kycType: advanceStatusData?.kycType,
      standardAlias: advanceStatusData?.standardAlias,
      financeComplianceType: advanceStatusData?.complianceType,
    })
      .then(async res => {
        const {webApiHost} = await getNativeInfo();
        const standardAlias = advanceStatusData?.standardAlias;
        const url = `https://${webApiHost}/account-compliance?complianceType=${standardAlias}&loading=2&dark=true&needLogin=true&appNeedLang=true`;
        openNative(`/link?url=${encodeURIComponent(url)}`);
      })
      .catch(err => {
        err.msg && showToast(err.msg);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  // KYB暂时隐藏advance入口
  const renderAdvanceStatus = () => {
    if (
      !advanceStatus ||
      advanceStatusData?.kycType === 'KYB' ||
      kycInfo?.kycType === 'KYB'
    ) {
      return null;
    }
    // 认证中
    if (
      advanceStatus === kycStatusEnum.ADVANCE_VERIFYING ||
      advVerifiedPending
    ) {
      return <AdvanceVerifying />;
    }
    // 认证失败
    if (advanceStatus === kycStatusEnum.ADVANCE_REJECTED) {
      return (
        <AdvanceRejected
          onStartAdvance={onStartAdvance}
          failReason={advanceStatusData?.failedReason}
          isBtnLoading={isBtnLoading}
        />
      );
    }
    // 认证成功
    if (advanceStatus === kycStatusEnum.ADVANCE_VERIFIED) {
      return <AdvanceVerified onStartAdvance={onStartAdvance} />;
    }
    return (
      <AdvanceUnverified
        isBaseVerified={isBaseVerified}
        onStartAdvance={onStartAdvance}
        isBtnLoading={isBtnLoading}
      />
    );
  };

  return (
    <>
      {/* 基础认证 */}
      <BaseVerifyWrapper>{renderStatus()}</BaseVerifyWrapper>
      {/* advance 认证 */}
      {renderAdvanceStatus()}
      {/* 权益 */}
      <Privileges
        status={status}
        advanceStatus={advanceStatus}
        isLoading={isFirstLoading}
      />
      {/* 选类型抽屉 */}
      <Drawer show={show} onClose={() => setShow(false)} header={<></>}>
        <DrawerContent>
          <CloseBox>
            <TouchableOpacity onPress={() => setShow(false)}>
              <CloseIcon source={useIconSrc('drawerClose')} />
            </TouchableOpacity>
          </CloseBox>
          <UserTypeIcon source={useIconSrc('userType')} />
          <VerifyTipText>{_t('c77475e457a74000a45f')}</VerifyTipText>
          <VerifyTipFooter>
            <Button
              style={{flex: 1, marginRight: 9}}
              type="secondary"
              onPress={() => {
                setShow(false);
                navigation.push('KYBPage_TH');
              }}>
              {_t('2268131fde024000a0d2')}
            </Button>
            <Button
              style={{flex: 1}}
              onPress={() => {
                setShow(false);
                navigation.push('KYCCitizenshipPage_TH');
              }}>
              {_t('8b433f7ef4b84000af18')}
            </Button>
          </VerifyTipFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
});
