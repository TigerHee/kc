/*
 * @owner: borden@kupotech.com
 */
import * as ws from '@kc/socket';
import useWorkerSubscribe from '../useWorkerSubscribe';
import useOrderValidate from '@/pages/OrderForm/components/OrderTypeTab/useOrderValidate';
import { useThrottleVoice } from '@/pages/Orders/Common/hooks/useThrottleVoice';
import useInitCurrentSymbol from './useInitCurrentSymbol';
import useInitCurrentTheme from './useInitCurrentTheme';
import useRegisterSocketCallback from './useRegisterSocketCallback';
import useInitRequest from './useInitRequest';
import useSocketFallback from './useSocketFallback';
import useDocumentTitle from './useDocumentTitle';
import useTdk from './useTdk';
import useRenewalSession from './useRenewalSession';
import useRealInteraction from './useRealInteraction';

export default function usePageInit() {
  // 初始化当前主题
  useInitCurrentTheme();
  // 初始化当前币对
  useInitCurrentSymbol();
  // 接入@kc/tdk
  useTdk();
  // 更新document title
  useDocumentTitle();

  // 初始化请求
  useInitRequest();
  // 轮训兜底
  useSocketFallback();
  // 初始化一些订单校验逻辑（是否展示 OCO、TSO）
  useOrderValidate();
  // 当前委托 websocket 监听，声音节流
  useThrottleVoice();
  // 注册推送的数据的处理回调
  useRegisterSocketCallback();
  // 订阅消息中心推送
  useWorkerSubscribe(ws.Topic.NOTICE_CENTER, true);
  // session自动续期逻辑
  useRenewalSession();
  // 页面行为检测
  useRealInteraction();
}
