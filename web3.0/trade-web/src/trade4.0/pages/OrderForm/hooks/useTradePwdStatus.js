/*
 * @owner: borden@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import { useSnackbar } from '@kux/mui/hooks';
import { isFuturesNew } from '@/meta/const';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import { _t } from 'src/utils/lang';

export default function useTradePwdStatus() {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const isLogin = useSelector((state) => state.user.isLogin);
  const securtyStatus = useSelector((state) => state.user.securtyStatus);
  const isNeedVerify = useSelector((state) => state.security.needVerifyTradePwd);

  const setIsNeedVerify = useMemoizedFn((nextIsNeedVerify) => {
    dispatch({
      type: 'security/update',
      payload: {
        needVerifyTradePwd: nextIsNeedVerify,
      },
    });
  });

  const checkVerify = useMemoizedFn(async () => {
    if (!isLogin) {
      return -1;
    }
    let verifyType;
    try {
      const result1 = await dispatch({
        type: 'security/get_verify_type',
        payload: { bizType: 'EXCHANGE' },
      });
      verifyType = result1;
      console.log('result1 --->', result1);
      if (isFuturesNew() && (!verifyType || !verifyType.length)) {
        const result2 = await dispatch({
          type: 'security/get_verify_type',
          payload: { bizType: 'CONTRACT_TRADE' },
        });
        verifyType = result2;
      }
      console.log('verifyType --->', verifyType);
    } catch (e) {
      verifyType = null;
    }
    if (verifyType === null) {
      message.error(_t('trd.verify.init.fail'));
      return -1;
    }
    const nextIsNeedVerify = Boolean(verifyType?.length);
    setIsNeedVerify(nextIsNeedVerify);

    return nextIsNeedVerify;
  });

  return {
    checkVerify,
    isNeedVerify,
    setIsNeedVerify,
    hasPwd: securtyStatus.WITHDRAW_PASSWORD,
  };
}
