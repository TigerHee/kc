/**
 * Owner: saiya.lee@kupotech.com
 */
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useLocale } from '@kucoin-base/i18n';
import { numberFormat } from '@kux/mui/utils';
import {
  pullWelfareInviteTaskStatus,
  postWelfareInviteTaskSign,
  pullWelfareInviteTaskTicket,
  postWelfareInviteTaskReceive,
 } from 'src/services/votehub'
 import { _t } from 'tools/i18n';


export function useViewModel() {
  const { currentLang } = useLocale();
  const isLogin = useSelector((state) => state.user.isLogin);
  // 是否有除了邀请任务之外的任务, 用于判断是否显示分割线
  const hasExtraTask = useSelector((state) => state.votehub.welfareList?.length > 0);
  // 邀请任务信息
  const [taskInfo, setTaskInfo] = useState(null);
  // 邀请任务获得的票数
  const [ticketCount, setTicketCount] = useState(0);
  const dispatch = useDispatch();

  // 获取邀请任务状态
  useEffect(() => {
    pullWelfareInviteTaskStatus().then((res) => {
      if (!res.data) return
      setTaskInfo(res.data);
    }).catch((error) => {
      // 活动不存在(已下线)
      if (error.code === '130001') return;
      console.error('Fail to get invite task', error);
    });
  }, [])

  // 格式化任务信息中的数字
  const formattedTaskInfo = useMemo(() =>
    formatTaskInfo(taskInfo, currentLang),
  [taskInfo, currentLang]);

  // 报名任务, 查询票数
  useEffect(() => {
    if (!isLogin || !taskInfo) return
    // 自动报名
    postWelfareInviteTaskSign(taskInfo.activityCode).catch((error) => console.error('invite task sign failed', error));
    // 查询票数
    pullWelfareInviteTaskTicket(taskInfo.activityCode).then((res) => {
      setTicketCount(res.data || 0);
    }).catch((error) => {
      console.error('failed to get invite task ticket', error);
    });
  }, [isLogin, taskInfo])


  /**
   * 领取上币票
   */
  const receiveTicket = useCallback(async () => {
    if (!taskInfo || !ticketCount) return
    try {
      const res = await postWelfareInviteTaskReceive(taskInfo.activityCode)
      // 没有可领取的票数
      if (!res.data) {
        dispatch({
          type: 'app/setToast',
          // 没有可领取的票数
          payload: { type: 'error', message: _t('77de6cf101344000afea') },
        })
      } else {
        // 显示领奖成功的弹窗
        dispatch({
          type: 'votehub/update',
          payload: {
            taskSuccessNum: res.data,
            taskModal: false,
            taskSuccessModal: true,
          },
        });
      }
      // 票数置空
      setTicketCount(0);

    } catch (error) {
      dispatch({
        type: 'app/setToast',
        payload: { type: 'error', message: error.msg || error.message },
      })
    }
    // 不论成功和失败均重新拉取可领取票数, 保证数据同步
    dispatch({
      type: 'votehub/pullAvailableVotes',
    });
  }, [taskInfo, ticketCount, dispatch])

  return {
    hasExtraTask,
    ticketCount,
    receiveTicket,
    /**
     * 任务信息
     */
    taskInfo: formattedTaskInfo,
  };
}

export function useAsyncCallback(callback) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const asyncCallback = useCallback(async (...args) => {
    if (loading || !callback ) return;
    setLoading(true);
    setError(null);
    try {
      await callback(...args);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  }, [callback, loading]);

  return [asyncCallback, loading, error];
}


/**
 * 格式化任务信息中的数字
 */
function formatTaskInfo(taskInfo, lang) {
  if (!taskInfo) return null;
  const numberFields = ['kycPoint', 'depositAmount', 'depositPoint', 'tradeAmount', 'tradePoint', 'inviteAmount'];
  const formatted = {};
  numberFields.forEach((field) => {
    formatted[field] = numberFormat({ lang, number: taskInfo[field] || 0 });
  });
  return formatted;
}
