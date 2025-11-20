/**
 * Owner: mike@kupotech.com
 */
import styled from '@emotion/styled';
import { _t, _tHTML } from 'Bot/utils/lang';

// 提交修改然后刷新
export const postAndFresh =
  ({ dispatch, id, onFresh, message }) =>
  async (data) => {
    await dispatch({
      type: 'automaticinverst/updateBotParams',
      payload: {
        data: {
          taskId: id,
          ...data,
        },
      },
    }).then((res) => {
      if (res && res.success) {
        message.success(_t('runningdetail'));
      }
    });
    // 修改至后刷新借口
    await onFresh();
    return new Promise((r, j) => {
      setTimeout(r);
    });
  };
