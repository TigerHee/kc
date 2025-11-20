/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useResponsive, useSnackbar } from '@kux/mui';
import { searchToJson } from 'helper';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import useKyc3Status from './useKyc3Status';

const { app_line, soure } = searchToJson();
export default ({ setCurrentRoute, setShowModal }) => {
  const dispatch = useDispatch();
  const kycInfo = useSelector((s) => s.kyc.kycInfo);
  const { message } = useSnackbar();
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  // 前置风控
  const checkRisk = async (isClear) => {
    const { data, success, code, msg } = await dispatch({ type: 'kyc/checkKycRisk', payload: {} });
    if (data && success) {
      setCurrentRoute(
        isH5
          ? kycInfo.primaryVerifyStatus === 0 || isClear
            ? 'kyc1'
            : ['bvn', 'nin'].includes(kycInfo?.identityType)
            ? 'kyc1'
            : 'kyc1Info'
          : 'app',
      );
      setShowModal(true);
    } else {
      //风控未通过
      message.error(code === '710015' ? _t('ukZa2Rk7VMcJeL3NreTxjc') : msg);
    }
  };

  const onClickVerify = async () => {
    trackClick(['StarOrCheck', '1'], {
      KYC_level: kycInfo.primaryVerifyStatus === 1 ? 2 : 1,
      app_line: app_line || '',
      soure: soure || '',
      user_kyc_status: kycInfo?.verifyStatus,
    });
    if (
      [
        kyc3StatusEnum.UNVERIFIED,
        kyc3StatusEnum.SUSPEND,
        kyc3StatusEnum.REJECTED,
        kyc3StatusEnum.CLEARANCE,
        kyc3StatusEnum.RESET,
      ].includes(kyc3Status)
    ) {
      let isClear = false;
      // 待打回状态额外处理一下
      if (kyc3StatusEnum.CLEARANCE === kyc3Status) {
        isClear = true;
      }

      await checkRisk(isClear);
    }
  };
  return {
    onClickVerify,
  };
};
