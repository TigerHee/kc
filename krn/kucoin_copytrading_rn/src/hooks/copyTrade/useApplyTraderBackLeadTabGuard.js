import {useMemoizedFn} from 'ahooks';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {KRNEventEmitter} from '@krn/bridge';
import {storage} from '@krn/toolkit';

const ENABLE_ACTIVE_FLAG = '1';

export class ApplyTraderSuccessBackLeadController {
  static CACHE_KEY = 'applyTraderBackActiveLeadFlag';

  static needActive = async () => {
    const need = (await storage.getItem(this.CACHE_KEY)) === ENABLE_ACTIVE_FLAG;

    return need;
  };

  static clearFlag = async () => {
    return await storage.setItem(this.CACHE_KEY, '');
  };

  static markBackMainPageActiveLeadTab = async () => {
    await storage.setItem(this.CACHE_KEY, ENABLE_ACTIVE_FLAG);
  };
}

export const useApplyTraderBackLeadTabGuard = () => {
  const dispatch = useDispatch();
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);

  const initGuard = useMemoizedFn(async () => {
    const need = await ApplyTraderSuccessBackLeadController.needActive();
    if (!need) return;
    dispatch({type: 'leadInfo/pullUserLeadInfo'});
    dispatch({type: 'leadInfo/update', payload: {isLeadTrader: true}});

    ApplyTraderSuccessBackLeadController.clearFlag();
  });

  useEffect(() => {
    // 监听页面进入前台
    const subscriptionShow = KRNEventEmitter.addListener('onShow', () => {
      initGuard();
      if (!isLeadTrader) {
        dispatch({type: 'leadInfo/pullUserLeadInfo'});
      }
    });

    return () => {
      subscriptionShow && subscriptionShow.remove();
    };
  }, [dispatch, initGuard, isLeadTrader]);
};
