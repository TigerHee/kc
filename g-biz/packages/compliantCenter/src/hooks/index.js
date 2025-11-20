/**
 * Owner: terry@kupotech.com
 */
import { useMemo, useEffect } from 'react';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import { track as trackBiz } from '../utils';
import { useHelperState } from './useHelperState';
import { isSSG } from '../../../entrance/src/common/tools';

export const useCompliaceRedirect = () => {
  const { isError: _isError, observeEnable } = useHelperState();
  // 接口调用异常且没有在观察期，则跳转到错误重试页面
  const isError = !isSSG && _isError;
  const isRedirect = isError === true && observeEnable === false;
  useEffect(() => {
    if (!isRedirect) return;
    const url = addLangToPath(
      `/forbidden?type=compliance&url=${encodeURIComponent(window.location.href)}`,
      storage.getItem('kucoinv2_lang'),
    );
    setTimeout(() => {
      window.location.replace(url);
    }, 0);
  }, [isRedirect]);
};

export const useCompliantShowWithInit = (spm, { track = false } = {}) => {
  const { rulers, isError, active, observeEnable, init } = useHelperState();
  const show = useMemo(() => {
    let _show;
    if (isSSG) return false;
    // 没有命中灰度，走原有逻辑（直接显示）
    if (!active) return true;
    // 接口加载失败，不显示
    if (isError) {
      _show = !!observeEnable;
    } else if (!spm || !rulers) {
      _show = false;
    } else {
      // 规则列表没有spm，则需要显示
      _show = rulers[spm] === undefined;
    }
    if (track) {
      trackBiz({
        data: {
          category: 'compliantCenter',
          name: 'isShow',
          show: _show,
          spm,
        },
      });
    }
    return _show;
  }, [spm, rulers, isError, active, track, observeEnable]);
  return {
    show,
    init,
  };
};

export const useCompliantShow = (spm, { track = false } = {}) => {
  const { show } = useCompliantShowWithInit(spm, { track });
  return show;
};
