import { useResponsive, useSnackbar } from '@kux/mui';
import { intersection } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getKycResultV2, postKycCancelV2, postKycCreate } from 'services/kyc';
import getSource from 'src/utils/getSource';
import { KYC_CERT_PASSED_ENUM, KYC_STATUS_ENUM } from '../constants/kyc/enums';

const INIT_KYC_INFO = {
  status: null,
  failReasonList: [],
  extraInfo: null,
};

/**
 * 调用 kyc 中台功能
 * kyc/kyb 认证都迁移到此 hook，避免放在 dva
 */
export default ({ type }) => {
  const labelList = useSelector((state) => state.kyc?.kycInfo?.labelList ?? []);
  const [result, setResult] = useState(INIT_KYC_INFO);
  const [loading, setLoading] = useState(false);
  const { message } = useSnackbar();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const pullResult = async () => {
    const labels = intersection(labelList || [], KYC_CERT_PASSED_ENUM[type] || []);
    if (labels.length) {
      // 检查用户有没有相应认证的标签（平台数据），有就不用请求中台数据，直接返回认证成功状态
      // Q: 为什么不能直接查中台数据？
      // A: 因为业务可能通过直接改数据库给用户打上标签绕过中台认证，这个场景中台和平台数据会不一致
      const value = { status: KYC_STATUS_ENUM.VERIFIED, failReasonList: [], extraInfo: null };
      setResult(value);
      return;
    }
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const res = await getKycResultV2({ type });
      if (!res.success) throw res;
      const { status = null, failReasonList = [], extraInfo = null } = res.data ?? {};
      setResult({ status, failReasonList, extraInfo });
    } catch (error) {
      message.error(error?.msg || error?.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /** 发起认证 */
  const start = async (extraInfo) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await postKycCreate({
        type,
        source: getSource(isH5),
        complianceExtraInfo: extraInfo ? JSON.stringify(extraInfo) : undefined,
      });
      return data.standardAlias;
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };
  /** 取消认证 */
  const cancel = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await postKycCancelV2({ type });
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    pullResult,
    start,
    cancel,
    loading,
  };
};
