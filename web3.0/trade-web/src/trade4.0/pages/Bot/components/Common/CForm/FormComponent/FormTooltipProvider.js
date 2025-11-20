/**
 * Owner: mike@kupotech.com
 * 该 Provider 主要控制 Tooltip 消息的展示，消息体构成
 * { [name]: { message: '', show: boolean } } message 代表展示的提示信息，show 代表是否展示
 * 目前接收两种格式的 event 消息，type: close | update
 * event 消息体 { type: '', data: [ { message, name } ] } || { type: '', data: { message, name } }
 * eventName 可以传递，防止事件重复
 */
import React, { useReducer, useMemo } from 'react';
import { forEach } from 'lodash';
import { FormTooltipContext, CLOSE_TOOLTIP, UPDATE_TOOLTIP } from './config';
import { useResponsive } from '@kux/mui';

// 定义 reducer
const tooltipsReducer = (state, action) => {
  switch (action.type) {
    case CLOSE_TOOLTIP: {
      const newStateClose = { ...state };

      // 更新 close 字段
      if (Array.isArray(action.data)) {
        // 判断是否有值，有值，则循环传入data
        if (action.data.length) {
          forEach(action.data, (name) => {
            if (newStateClose[name]) {
              newStateClose[name].show = false;
            } else {
              newStateClose[name] = { show: false };
            }
          });
        } else {
          // 判断传入是否为空数组，空数组重置所有的值
          forEach(newStateClose, (__, name) => {
            newStateClose[name] = { show: false };
          });
        }
      } else if (typeof action.data === 'object' && action.data.exclude) {
        // exclude排出的， 就是不关闭的， 其余关闭
        forEach(newStateClose, (__, name) => {
          if (!action.data.exclude.includes(name)) {
            newStateClose[name] = { show: false };
          }
        });
      } else if (newStateClose[action.data]) {
        newStateClose[action.data].show = false;
      } else {
        newStateClose[action.data] = { show: false };
      }
      return newStateClose;
    }
    case UPDATE_TOOLTIP: {
      const newStateUpdate = { ...state };

      // 更新 Tooltips message 字段
      if (Array.isArray(action.data)) {
        forEach(action.data, (item) => {
          newStateUpdate[item.name] = { message: item.message, show: true };
        });
      } else {
        newStateUpdate[action.data.name] = { message: action.data.message, show: true };
      }
      return newStateUpdate;
    }

    default:
      return state;
  }
};

const FormTooltipProvider = ({ children, activeTooltipCheck = true }) => {
  const [tooltipsMap, dispatch] = useReducer(tooltipsReducer, {});
  const { lg, xl } = useResponsive();
  const isBigScreen = lg || xl;
  const ctxVal = useMemo(() => {
    return { tooltipsMap, dispatch, activeTooltipCheck, isBigScreen };
  }, [tooltipsMap, activeTooltipCheck, isBigScreen]);

  return <FormTooltipContext.Provider value={ctxVal}>{children}</FormTooltipContext.Provider>;
};

export default React.memo(FormTooltipProvider);
