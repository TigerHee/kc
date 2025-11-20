import React, {memo, useEffect, useMemo, useState} from 'react';
import {KRNEventEmitter} from '@krn/bridge';
import {getNativeInfo, compareVersion} from 'utils/helper';
import {Unverified, Verifying, Rejected, Suspend, Verified} from './VerifyArea';
import {KybVerified, KybVerifying} from './kyb';
import Privileges from './Privileges';
import Clearance from './Clearance';
import Reset from './Reset';
import useKyc3Status from './hooks/useKyc3Status';
import useClickVerify from './hooks/useClickVerify.js';
import useTracker from 'hooks/useTracker';
import {VerifyPlaceholder} from './Placeholder';
import PI from './PI';
import {useDispatch, useSelector} from 'react-redux';
import Migrate from './Migrate';

export default memo(() => {
  const dispatch = useDispatch();
  const financeListKYC = useSelector(s => s.kyc.financeListKYC);
  const isPageLoading = useSelector(s => s.kyc.isPageLoading);
  const isLogin = useSelector(state => state.app.isLogin);
  const {
    kyc3Status,
    kyc3StatusEnum,
    trackStatus,
    isFirstLoading,
    fetchAll,
    isShowKyb,
    kybInfo,
  } = useKyc3Status();
  const {onClickVerify} = useClickVerify({
    kyc3Status,
    kyc3StatusEnum,
    trackStatus,
  });
  const {onPageExpose} = useTracker();
  // 是否渲染迁移入口
  const [isCanMigrate, setCanMigrate] = useState(false);

  useEffect(() => {
    const onGetList = isDealLoading => {
      if (isLogin && kyc3Status && kyc3Status !== kyc3StatusEnum.UNVERIFIED) {
        dispatch({
          type: 'kyc/pullFinanceList',
          payload: {
            isDealLoading,
            kycType: 'KYC',
          },
        });
      }
    };
    onGetList(true);

    const subscription = KRNEventEmitter.addListener('onShow', () => {
      onGetList(false);
    });
    return () => {
      subscription?.remove();
    };
  }, [kyc3Status, kyc3StatusEnum, dispatch, isLogin]);

  useEffect(() => {
    if (trackStatus !== 0) {
      onPageExpose({
        properties: {
          kyc_homepage_status: trackStatus,
        },
      });
    }
  }, [trackStatus]);

  const getShowMigrate = async () => {
    const {version} = await getNativeInfo();
    if (compareVersion(version, '3.141.0') >= 0) {
      setCanMigrate(true);
    }
  };

  useEffect(() => {
    getShowMigrate();
  }, []);

  // 是否展示 PI 流程
  const isShowPI = useMemo(() => {
    return financeListKYC?.length > 0;
  }, [financeListKYC]);

  const renderStatus = () => {
    // 加载中
    if (isFirstLoading || isPageLoading) {
      return <VerifyPlaceholder />;
    }

    // KYB
    if (isShowKyb) {
      if (kybInfo?.verifyStatus === 1) {
        return <KybVerified />;
      }
      return <KybVerifying />;
    }

    if (isShowPI) {
      return (
        <PI
          {...{kyc3Status, kyc3StatusEnum, trackStatus}}
          onClickVerify={onClickVerify}
        />
      );
    }

    // 未认证
    if (kyc3StatusEnum.UNVERIFIED === kyc3Status) {
      return <Unverified onClickVerify={onClickVerify} />;
    }

    // 认证中、假失败
    if ([kyc3StatusEnum.VERIFYING, kyc3StatusEnum.FAKE].includes(kyc3Status)) {
      return <Verifying fake={kyc3StatusEnum.FAKE === kyc3Status} />;
    }

    // 认证中断
    if (kyc3StatusEnum.SUSPEND === kyc3Status) {
      return <Suspend onClickVerify={onClickVerify} />;
    }

    // 认证失败
    if (kyc3StatusEnum.REJECTED === kyc3Status) {
      return (
        <Rejected onClickVerify={onClickVerify} trackStatus={trackStatus} />
      );
    }

    // 认证成功
    if (kyc3StatusEnum.VERIFIED === kyc3Status) {
      return <Verified trackStatus={trackStatus} />;
    }

    // 待打回
    if (kyc3StatusEnum.CLEARANCE === kyc3Status) {
      return <Clearance onClickVerify={onClickVerify} fetchAll={fetchAll} />;
    }

    // 已打回
    if (kyc3StatusEnum.RESET === kyc3Status) {
      return <Reset onClickVerify={onClickVerify} />;
    }
    return null;
  };

  return (
    <>
      {isCanMigrate ? <Migrate /> : null}

      {renderStatus()}
      {isShowKyb || isShowPI ? null : (
        <Privileges
          kyc3Status={kyc3Status}
          isLoading={isFirstLoading}
          noMarginTop={isShowPI}
        />
      )}
    </>
  );
});
