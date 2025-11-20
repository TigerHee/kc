/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useSnackbar } from '@kux/mui';
import { searchToJson } from 'helper';
import { useDispatch, useSelector } from 'react-redux';
import { getIdentityTypes, getSumsubDelete } from 'services/kyc';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import useKyc3Status from './useKyc3Status';

const { app_line, soure } = searchToJson();
export default ({ setCurrentRoute, setShowModal }) => {
  const dispatch = useDispatch();
  const kycInfo = useSelector((s) => s.kyc.kycInfo);
  const { message } = useSnackbar();
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const kycClearInfo = useSelector((s) => s.kyc.kycClearInfo);

  // 前置风控
  const checkRisk = async (isClear) => {
    const { data, success, code, msg } = await dispatch({ type: 'kyc/checkKycRisk', payload: {} });
    if (data && success) {
      const res = await getIdentityTypes({ region: kycInfo.regionCode });
      if (res?.data?.localIdentityTypeList?.find((i) => i.type === kycInfo.identityType)) {
        setShowModal(true);
        setCurrentRoute('loading');
        if (kycClearInfo?.clearStatus === 1) {
          await dispatch({ type: 'kyc/updateClearInfo' });
        }
        //获取kyc3渠道
        const data = await dispatch({
          type: 'kyc/getKyc2Channel',
          payload: { biz: 'DEFAULT' },
        });
        if (!data?.channel) {
          data.msg && message.error(data.msg);
          return;
        }

        //jumio
        if (data?.channel === 'JUMIO') {
          setCurrentRoute('jumio');
        } else if (data?.channel === 'SUMSUB') {
          try {
            await getSumsubDelete();
          } catch (error) {}
          setCurrentRoute('SUMSUB');
        } else {
          //兜底lego
          setCurrentRoute('legoIndex');
          dispatch({
            type: 'kyc/update',
            payload: {
              legoCameraStep: '',
              showCamera: false,
              legoPhotos: {},
              photoType: 'front',
            },
          });
        }
        return;
      }

      setCurrentRoute('kyc1');
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
