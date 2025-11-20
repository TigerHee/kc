/**
 * Owner: garuda@kupotech.com
 * 前端计算提供的一些方法
 */
import { greaterThanOrEqualTo } from 'utils/operation';

import { eventEmmiter } from '@/pages/Futures/import';

const event = eventEmmiter.getEvt('futures-socket-calc');

const LOCK_DURATION_MS = 3000;

export class TriggerControl {
  constructor(props) {
    this.eventName = props.eventName;
    this.timer = null;
    this.state = {
      stack: [], // 缓存数组
      endTimer: null, // 结束时间
      startTimer: null, // 开始时间
      highTask: false, // 高优先级任务
      interval: null, // 时间间隔
    };
  }

  // 清空所有的状态
  resetAll = () => {
    if (this.state?.interval) {
      clearInterval(this.state.interval);
    }
    this.state = {
      stack: [],
      endTimer: null,
      startTimer: null,
      highTask: false,
      interval: null,
    };
  };

  emitCalc = () => {
    event.emit('futures_start_calc');
  };

  handleInterval = () => {
    const now = Date.now();
    // 时间间隔器到期，如果栈内还有值，则清空所有值，执行一次 emit 操作
    if (greaterThanOrEqualTo(now)(this.state.endTimer)) {
      if (this.state.stack?.length) {
        this.emitCalc();
      }
      this.resetAll();
    } else if (this.state.highTask) {
      // 如果有高优先级任务，则执行一次 emit，然后将 stack 清空，highTask 标识置为 false
      this.emitCalc();
      this.state.stack = [];
      this.state.highTask = false;
    }
  };

  lockUpdate = () => {
    // 如果此时是锁住的，不重新计算时间
    if (this.timer) {
      return;
    }
    this.timer = Date.now();
    event.emit('futures_start_calc_lock', true);
  };

  triggerCalc = (isHigh = false) => {
    const now = Date.now();
    // 如果此时是锁住的，计算当前时间跟之前锁住的时间差，小于 3s 则 return
    if (this.timer && now - this.timer <= LOCK_DURATION_MS) {
      return;
    }
    this.unlockUpdate();
    // 更新 stack 缓存数组，值设置为 1 占位
    this.state.stack.push(1);

    if (this.state?.endTimer) {
      // 判断当前长度是否大于 20
      if (this.state.stack?.length > 20) {
        this.resetAll();
        this.emitCalc();
      }
    } else {
      // 分配一个时间片段（1s），意思是 1s 内最多执行两次操作
      this.state.startTimer = now;
      this.state.endTimer = this.state.startTimer + 1000;

      // 有高优先级任务，设置一个状态，在一个时间片段内，只设置一次
      if (isHigh) {
        this.state.highTask = true;
      }

      // 设置定时器
      this.state.interval = setInterval(this.handleInterval, 250);
    }
  };

  unlockUpdate = () => {
    this.timer = null;
    event.emit('futures_start_calc_lock', false);
  };
}

const eventMap = {};
// 获取实例
TriggerControl.getInstance = (eventName, props) => {
  if (eventMap[eventName]) {
    return eventMap[eventName];
  }
  eventMap[eventName] = new TriggerControl({ eventName, ...props });
  return eventMap[eventName];
};

export const futuresCalcControl = TriggerControl.getInstance('futures_cross_calc');
