/*
 * @owner: borden@kupotech.com
 */
import { getStateFromStore } from '@/utils/stateGetter';
import voice from './index';

/**
 * @param {*} ele 元素
 * @returns 是否为可点击元素
 */
export const isClickable = (ele) => {
  if (!ele) return false;
  const { type, tagName } = ele;
  const onclick = ele.getAttribute('onclick');
  const cursorStyle = window.getComputedStyle(ele).cursor;
  return (
    onclick !== null ||
    cursorStyle === 'pointer' ||
    ['A', 'BUTTON'].includes(tagName) ||
    (tagName === 'INPUT' && type === 'button')
  );
};

/**
 * @description 逐仓杠杆强平
 * @param {*} tag 逐仓交易对
 * @param {*} status 逐仓仓位状态
 */
export const isolatedLiquidationNotify = ({ tag, status }) => {
  const { positionMap } = getStateFromStore(state => state.isolated);
  const { status: currentStatus } = positionMap[tag] || {};
  if (currentStatus !== status && status === 'IN_LIQUIDATION') {
    voice.notify('bankruptcy');
  }
};

/**
 * @description 全仓杠杆强平
 * @param {*} tag 逐仓交易对
 * @param {*} status 逐仓仓位状态
 */
export const crossLiquidationNotify = ({ data }) => {
  const { userPosition } = getStateFromStore(state => state.marginMeta);
  const { status: currentStatus } = userPosition || {};
  if (
    currentStatus !== data?.type &&
    ['FROZEN_RENEW', 'FROZEN_FL'].includes(data?.type)
  ) {
    voice.notify('bankruptcy');
  }
};

/**
 * @description 点击
 * @param {*} ele 元素
 * @param {*} skipCheck 跳过元素检测
 * 拖动布局中模块Tab的点击声音响应逻辑比较特殊，是在@/layouts/XlLayout/index.js中单独处理的
 */
export const clickEventNotify = (ele, skipCheck) => {
  if (skipCheck === true || isClickable(ele)) {
    voice.notify('click_event');
  }
};

/**
 * @description 输入 & 输入删除
 * @param {*} e 事件对象
 */
export const inputEventNotify = (e) => {
  switch (e?.inputType) {
    case 'insertText':
      voice.notify('keyboard_input');
      break;
    case 'deleteContentBackward':
      voice.notify('keyboard_delete');
      break;
    default:
      break;
  }
};
