/**
 * Owner: garuda@kupotech.com
 */
import { isObject, forEach } from 'lodash';

import { trackCustomEvent } from 'utils/ga';

import { TRADE_RESULT_TIMER, CANCEL_ORDER_TIMER } from '@/meta/futuresSensors/trade';

const collectEventMap = {};
/**
 * 自定义数据上报收集
 * 可传入 eventName,checkId, spmId
 * 添加参数可通过 addCustomerData， 挂载到 data 下
 * 时间间隔参数 addTimer 使用这个方法
 * 调用 sensorsReport 使用 trackCustomEvent 上报
 */
export class CollectSensors {
  constructor(props) {
    this.eventName = props.eventName;
    this.data = {}; // 需要上传的data
    this.timerMap = {}; // 存放自定义 timer 时间
    this.checkId = Boolean(props.checkId);
    this.spmId = props.spmId;
    this.tradeType = props.tradeType;
  }

  // 重置参数
  resetInit = () => {
    this.data = {};
    this.timerMap = {};
  };

  // 追加自定义上报参数到此次的 data 中，data必须为object 格式
  addCustomerData = (data) => {
    if (!isObject(data)) {
      console.warn('Collect Sensors addCustomerData data muse be Object');
      return;
    }
    this.data = { ...this.data, ...data };
  };

  // 自动处理 timer 传入 key 跟 是否为开始时间
  addTimer = (key, isStartTimer = true) => {
    try {
      const now = Date.now(); // 获取现有时间
      if (!isStartTimer) {
        if (!this.timerMap[key]) {
          this.timerMap[key] = {};
        }
        const { start } = this.timerMap[key];
        // 需要判断是否存在 start && start 时间是否大于30s，是则认为此次数据无效
        if (start && now - start <= 30000) {
          this.timerMap[key].duration = now - start;
        }
      } else {
        this.timerMap[key] = { start: now };
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 触发神策的自定义上报事件
  sensorsReport = (customerData) => {
    if (!isObject(customerData)) {
      console.warn('Collect Sensors addCustomerData data muse be Object');
      return;
    }
    this.data = { ...this.data, ...customerData };
    forEach(this.timerMap, (value, key) => {
      if (value && value.duration) {
        this.data[key] = value.duration;
      }
    });
    try {
      trackCustomEvent(
        {
          data: {
            ...this.data,
            trade_service_type: this.tradeType,
          },
          checkId: this.checkId,
          spmId: this.spmId,
        },
        this.eventName,
      );
    } catch (err) {
      console.error(err);
      trackCustomEvent(
        {
          data: {
            fail_reason: err,
            trade_service_type: this.tradeType,
          },
          checkId: this.checkId,
          spmId: String(this.spmId),
        },
        this.eventName,
      );
    } finally {
      // 重置所有的值
      this.resetInit();
    }
  };
}

// 获取实例
CollectSensors.getInstance = (eventName, props) => {
  try {
    if (collectEventMap[eventName]) {
      return collectEventMap[eventName];
    }
    collectEventMap[eventName] = new CollectSensors({ eventName, ...props });
    return collectEventMap[eventName];
  } catch (err) {
    // TIPS: 下单比较重要，需要确保一定不能影响主流程
    console.error(err);
    return {
      addCustomerData: () => {},
      addTimer: () => {},
      sensorsReport: () => {},
    };
  }
};

const TRADE_TYPE = 'Futures';

export const cancelOrderAnalyse = CollectSensors.getInstance(CANCEL_ORDER_TIMER, {
  tradeType: TRADE_TYPE,
});
export const tradeOrderAnalyse = CollectSensors.getInstance(TRADE_RESULT_TIMER, {
  tradeType: TRADE_TYPE,
});
