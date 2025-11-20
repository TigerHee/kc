/**
 * Owner: clyne@kupotech.com
 */
import { useCallback, useState, useEffect } from 'react';
import useI18n from '@/hooks/futures/useI18n';
import { debounce, isEqual, forEach } from 'lodash';
import { lessThan, dividedBy, equals, multiply } from 'utils/operation';
import { useDispatch, useSelector } from 'dva';
import { useMessage } from '@/hooks/futures/useMessage';
import { usePnlAlertFunc } from './usePnlAlert';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';
import { namespace } from '../config';

const rangeCheck = (value) => {
  const isInt = /^-?\d+$/.test(value);
  // 非整数 or 小于-90 return true 表示提示异常
  return !isInt || lessThan(value)('-90');
};

const ErrorCodeMap = {
  // roe输入类型范围异常
  200999: 'setting.pnl.error',
  // roe规则添加超过5个了
  200998: 'setting.pnl.error.over',
  // roe唯一性
  200997: 'setting.pnl.error.unique',
};

export const usePnlForm = (form) => {
  const { _t } = useI18n();
  const [msg, setMsg] = useState({});
  const { visible } = useDialog();
  const pnlList = useSelector((state) => state[namespace].pnlAlertList);

  useEffect(() => {
    // 没打开的时候，重置一下 msg 值
    if (!visible) {
      setMsg({});
    }
  }, [visible]);
  /**
   * error验证
   */
  const validator = useCallback(
    (_, v) => {
      const errorMsg = _t('setting.pnl.error');
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(v) || v === '' || rangeCheck(v)) {
        return Promise.reject(errorMsg);
      }
      let checkError = false;
      // 校验是否有重复值
      forEach(pnlList, (item) => {
        if (equals(v)(multiply(item?.unrealisedRoePcnt)(100))) {
          checkError = true;
        }
      });
      return checkError ? Promise.reject(_t('setting.pnl.error.unique')) : Promise.resolve();
    },
    [_t, pnlList],
  );

  /**
   * warnning验证
   */
  const warningValidate = useCallback((v) => {
    if (lessThan(v.unrealisedRoePcnt)('-50')) {
      return true;
    }
  }, []);

  /**
   * input change
   */
  const onValuesChange = useCallback(
    debounce((v) => {
      const errorMsg = form.getFieldError('unrealisedRoePcnt')[0];
      if (errorMsg) {
        return setMsg({
          msgType: 'error',
          info: errorMsg,
        });
      }
      if (warningValidate(v)) {
        return setMsg({
          msgType: 'warning',
          info: _t('setting.pnl.warning'),
        });
      }
      // reset
      setMsg({});
    }),
    [form],
  );

  // finish error
  const onFinishFailed = useCallback(({ errorFields } = {}) => {
    if (errorFields && errorFields[0]?.errors?.length) {
      setMsg({ msgType: 'error', info: errorFields[0]?.errors[0] });
    }
  }, []);

  /**
   * groupButton click
   */
  const onButtonChange = useCallback(
    (v) => {
      if (form) {
        form.setFieldsValue({ unrealisedRoePcnt: v });
        form.validateFields();
        onValuesChange({ unrealisedRoePcnt: v });
      }
    },
    [form, onValuesChange],
  );
  return { onButtonChange, validator, setMsg, msg, onValuesChange, onFinishFailed };
};

/**
 * dialog
 */
export const useDialog = (form) => {
  const dispatch = useDispatch();
  const { visible, alertInfo } = useSelector((state) => {
    const stateMap = state[namespace];
    return {
      visible: stateMap.pnlAlertDialogVisible,
      alertInfo: stateMap.pnlAlertInfo,
    };
  }, isEqual);
  const setDialog = useCallback(
    (v) => {
      const isClose = !v;
      const payload = { pnlAlertDialogVisible: v };
      // 关闭的时候需要reset pnlAlertInfo state
      if (isClose) {
        payload.pnlAlertInfo = {};
      }
      // 更新dialog状态，or pnlAlertInfo
      dispatch({
        type: `${namespace}/update`,
        payload,
      });
      // close reset form
      isClose && form && form.resetFields();
    },
    [dispatch, form],
  );
  const onCancel = useCallback(() => {
    setDialog(false);
  }, [setDialog]);

  return { visible, setDialog, onCancel, alertInfo };
};

/**
 * 表单逻辑
 */
export const useActionSubmit = (form) => {
  const { _t } = useI18n();
  const dispatch = useDispatch();
  const { message } = useMessage();
  const { setDialog, alertInfo } = useDialog(form);
  const { getPnlAlertList } = usePnlAlertFunc();
  const currentSymbol = useGetCurrentSymbol();

  const formSubmit = useCallback(
    async (v) => {
      const unrealisedRoePcnt = dividedBy(v.unrealisedRoePcnt)(100).toString();
      const params = {
        symbol: currentSymbol,
        unrealisedRoePcnt,
      };
      if (alertInfo && alertInfo.id != null) {
        params.id = alertInfo.id;
      }
      // 请求
      const {
        msg,
        message: _msg,
        code,
        success,
      } = await dispatch({
        type: `${namespace}/submitPnlAlertConfig`,
        payload: params,
      });
      // toast
      if (success) {
        message.success(_t('success'));
      } else {
        const errorM = ErrorCodeMap[code] ? _t(ErrorCodeMap[code]) : null;
        message.error(errorM || msg || _msg || _t('setting.pnl.save.fail'), 'error');
      }
      // close dialog
      setDialog(false);
      // update pnl alert list
      getPnlAlertList();
    },
    [_t, alertInfo, currentSymbol, dispatch, getPnlAlertList, message, setDialog],
  );
  return { formSubmit };
};
