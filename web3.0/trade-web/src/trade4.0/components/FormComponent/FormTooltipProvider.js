/**
 * Owner: garuda@kupotech.com
 * 该 Provider 主要控制 Tooltip 消息的展示，消息体构成
 * { [name]: { message: '', show: boolean } } message 代表展示的提示信息，show 代表是否展示
 * 目前接收两种格式的 event 消息，type: close | update
 * event 消息体 { type: '', data: [ { message, name } ] } || { type: '', data: { message, name } }
 * eventName 可以传递，防止事件重复
 */
import React, { useReducer, useEffect, useCallback } from 'react';
import { forEach } from 'lodash';

import { evtEmitter } from 'helper';
import {
  FormTooltipContext,
  TOOLTIP_EVENT_KEY,
  CLOSE_TOOLTIP,
  UPDATE_TOOLTIP,
  FormTooltipDispatchContext,
} from './config';

const eventHandle = evtEmitter.getEvt();

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

const FormTooltipProvider = ({ children, eventName = '' }) => {
  const [tooltipsMap, dispatch] = useReducer(tooltipsReducer, {});

  const handleSetTooltipsMap = useCallback(({ type, data }) => {
    switch (type) {
      case 'close':
        dispatch({ type: CLOSE_TOOLTIP, data });
        break;
      case 'update':
        dispatch({ type: UPDATE_TOOLTIP, data });
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    try {
      eventHandle.on(`${TOOLTIP_EVENT_KEY}_${eventName}`, handleSetTooltipsMap);
    } catch (error) {
      console.error('Failed to set event listener:', error);
    }

    return () => {
      try {
        eventHandle.off(`${TOOLTIP_EVENT_KEY}_${eventName}`, handleSetTooltipsMap);
      } catch (error) {
        console.error('Failed to remove event listener:', error);
      }
    };
  }, [eventName, handleSetTooltipsMap]);

  return (
    <FormTooltipContext.Provider value={tooltipsMap}>
      <FormTooltipDispatchContext.Provider value={dispatch}>
        {children}
      </FormTooltipDispatchContext.Provider>
    </FormTooltipContext.Provider>
  );
};

export default React.memo(FormTooltipProvider);
