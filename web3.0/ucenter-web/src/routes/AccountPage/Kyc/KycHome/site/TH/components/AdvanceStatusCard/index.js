/**
 * Owner: tiger@kupotech.com
 */
import { ComplianceDialog } from '@kucoin-gbiz-next/kyc';
import { useSnackbar, useTheme } from '@kux/mui';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAdvance } from 'services/kyc_th';
import { kycStatusEnum } from '../../constants';
import useKyc3Status from '../../hooks/useKyc3Status';
import Rejected from './Rejected';
import { StatusCardWrapper } from './style';
import Unverified from './Unverified';
import Verified from './Verified';
import Verifying from './Verifying';

export default () => {
  const dispatch = useDispatch();
  const { advanceStatusData, kycInfo } = useSelector((state) => state.kyc_th);
  const theme = useTheme();
  const { message } = useSnackbar();
  const { advanceStatus, advVerifiedPending } = useKyc3Status();
  const [complianceDialogOpen, setComplianceDialogOpen] = useState(false);
  const [isBtnLoading, setBtnLoading] = useState(false);

  // 开始认证
  const onClickVerify = debounce(() => {
    setBtnLoading(true);
    postAdvance({
      kycType: advanceStatusData?.kycType,
      standardAlias: advanceStatusData?.standardAlias,
      financeComplianceType: advanceStatusData?.complianceType,
    })
      .then((res) => {
        setComplianceDialogOpen(true);
      })
      .catch((err) => {
        err.msg && message.error(err.msg);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  }, 200);

  const StatusCom = useMemo(() => {
    // 认证中
    if (advanceStatus === kycStatusEnum.ADVANCE_VERIFYING || advVerifiedPending) {
      return <Verifying />;
    }
    // 认证成功
    if (advanceStatus === kycStatusEnum.ADVANCE_VERIFIED) {
      return <Verified onClickVerify={onClickVerify} />;
    }
    // 认证失败
    if (advanceStatus === kycStatusEnum.ADVANCE_REJECTED) {
      return (
        <Rejected
          onClickVerify={onClickVerify}
          failedReason={advanceStatusData?.failedReason}
          isBtnLoading={isBtnLoading}
        />
      );
    }
    // 未认证
    return <Unverified onClickVerify={onClickVerify} isBtnLoading={isBtnLoading} />;
  }, [advanceStatus, advanceStatusData, advVerifiedPending, isBtnLoading]);

  // KYB暂时隐藏advance入口
  return !advanceStatus ||
    advanceStatusData?.kycType === 'KYB' ||
    kycInfo?.kycType === 'KYB' ? null : (
    <StatusCardWrapper>
      {StatusCom}

      <ComplianceDialog
        open={complianceDialogOpen}
        onCancel={() => {
          dispatch({ type: 'kyc_th/pullAdvanceList' });
          setComplianceDialogOpen(false);
        }}
        onOk={() => {
          dispatch({ type: 'kyc_th/pullAdvanceList' });
          setComplianceDialogOpen(false);
        }}
        theme={theme.currentTheme}
        complianceType={advanceStatusData?.standardAlias}
        hideFormFooterPreBtn
      />
    </StatusCardWrapper>
  );
};
