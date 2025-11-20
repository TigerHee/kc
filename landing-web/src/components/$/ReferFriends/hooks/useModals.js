/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { useCallback } from 'react';

const useModals = () => {
  const dispatch = useDispatch();
  const { curModalId } = useSelector((state) => state.referFriend);

  const showModal = useCallback((id) => {
    dispatch({
      type: 'referFriend/update',
      payload: {
        curModalId: id,
      },
    });
  }, []);

  const clearModal = useCallback(async () => {
    await dispatch({
      type: 'referFriend/update',
      payload: {
        curModalId: '',
      },
    });
  }, []);

  const triggerGetGift = useCallback(async (id) => {
    const data = await dispatch({
      type: 'referFriend/getGift',
    });

    return data;
  }, []);

  // 初始化弹窗; isBeInvitedMan 邀请人/被邀请人两种情况都有
  const initModal = useCallback(async ({ referInfo = {}, isBeInvitedMan }) => {
    // "campaignStartTime": 1684327102271, //活动开始时间
    //     "campaignEndTime": 1684327102271, //活动结束时间
    //     "login": true, //是否登录
    //     "partner": true, //是否合伙人
    //     "firstEnter": true, //是否首次进入活动页面
    //     "firstTradeCompleted": true, //是否完成首次交易
    //     "newUserSupported": true, //是否有新用户助力
    //     "totalSupportAmount": "49.213", //累计助力金额(U)
    //     "bonusGiftToBeObtain": true, //是否有待领取礼包
    const { login, firstEnter, platformAmount, newUserSupported, bonusGiftToBeObtain } = referInfo;

    if (!login) {
      // 未登录但是是被邀请人
      if (isBeInvitedMan) {
        showModal('BE_INVITER_BOOST_WELFARE_POPUP_WINDOW');
      }
      return;
    }

    let mid = '';
    // 邀请人
    if (!isBeInvitedMan) {
      // 判断是首次进入该活动
      if (firstEnter) {
        // 判断若邀请人是新用户/不是新用户 均弹出邀请人助力福利弹窗
        mid = 'INVITER_BOOST_WELFARE_POPUP_WINDOW';
      } else {
        // 非首次进入该活动
        // 但未进行平台助力，需要走平台助力流程
        if (platformAmount === null) {
          // 弹出邀请人助力福利弹窗;
          mid = 'INVITER_BOOST_WELFARE_POPUP_WINDOW';
        } else if (bonusGiftToBeObtain) {
          // 达到了礼包领取条件
          const gift = await triggerGetGift();

          if (gift?.awardId) {
            mid = 'BOOST_PRIZE_WINNING_POP_UP_WINDOW';
          }
        } else if (newUserSupported) {
          // 弹出【好友助力结果弹窗】
          mid = 'FRIENDS_HELP_RESULTS_WINDOW';
        }
      }
    } else {
      // 被邀请人流程
      // 是新用户/不是新用户 均弹出被邀请人助力福利弹窗
      mid = 'BE_INVITER_BOOST_WELFARE_POPUP_WINDOW';
    }

    showModal(mid);
    // showModal('TRADE_TIP');
  }, []);

  return {
    curModalId,
    clearModal,
    triggerGetGift,
    showModal,
    initModal,
  };
};

export default useModals;
