/*
 * @owner: borden@kupotech.com
 */
import { useBoolean } from 'ahooks';
import { useDispatch, useSelector } from 'dva';
import { useSnackbar } from '@kux/mui/hooks';
import { cryptoPwd } from 'src/helper';
import { _t } from 'src/utils/lang';
import { trackClick, track } from 'src/utils/ga';
import useSetState from '@/hooks/common/useSetState';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import { event } from '@/utils/event';
import { isFuturesNew } from '@/meta/const';

export const EXPIRATION_DATE = 24; // 单位：小时
export const VERIFY_END_EVENT_NAME = 'trade_pwd_verify_end';

export default function useTradePwd({ source }) {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const [close, { toggle: toggleClose }] = useBoolean(true);
  const verifyError = useSelector(state => state.setting.verifyError);
  const [state, setState] = useSetState({
    clearFlag: 0,
    password: '',
    isVerifing: false,
  });

  const { isVerifing, password, clearFlag } = state;

  const handleChange = useMemoizedFn(async (val) => {
    if (password.length === 6 && val.length === 6) {
      setState({ password: val });
      return;
    }
    setState({
      password: val,
      isVerifing: val.length === 6,
    });
    try {
      if (password.length < 6 && val.length === 6) {
        // console.log('start verify');
        // 开始校验
        let result;
        if (!isFuturesNew()) {
          result = await dispatch({
            type: 'security/sec_verify',
            payload: {
              bizType: 'EXCHANGE',
              validations: {
                withdraw_password: cryptoPwd(val),
              },
            },
          });
        } else {
          result = await dispatch({
            type: 'security/sec_verify_pwd_all',
            payload: {
              bizType: 'EXCHANGE',
              bizType2: 'CONTRACT_TRADE',
              validations: {
                withdraw_password: cryptoPwd(val),
              },
            },
          });
        }
        event.emit(VERIFY_END_EVENT_NAME, { source, res: result });
        if (result && result.code !== '200') {
          setState((prev) => ({
            clearFlag: prev.clearFlag + 1,
          }));
          dispatch({
            type: 'setting/update',
            payload: {
              verifyError: result.msg || 'error',
            },
          });
          track('spot_trade_TradingPassword_intercept');
          trackClick(['secretZone', '2']);
        } else {
          message.info(_t('aKcmkHvRdAL6gvZ5mLzHRb', { a: EXPIRATION_DATE }));
          trackClick(['secretZone', '1']);
        }
      }
    } catch (e) {
      trackClick(['secretZone', '2']);
    }
    setState({
      isVerifing: false,
    });
  });

  return {
    close,
    clearFlag,
    isVerifing,
    toggleClose,
    handleChange,
    error: verifyError,
  };
}
