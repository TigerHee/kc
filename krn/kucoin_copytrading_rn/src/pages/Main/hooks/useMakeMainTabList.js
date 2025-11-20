import {useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {copyTradingBridge} from '@krn/bridge';

import {useApplyTraderBackLeadTabGuard} from 'hooks/copyTrade/useApplyTraderBackLeadTabGuard';
import useLang from 'hooks/useLang';
import {isAndroid} from 'utils/helper';
import Home from '../../Home';
import MyCopies from '../../MyCopies';
import MyLeading from '../../MyLeading';
import {MAIN_TAB_KEYS} from '../constant';

const {requestRefreshCopyTradingAccountInfo} = copyTradingBridge;

export const useMakeMainTabList = () => {
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);

  useApplyTraderBackLeadTabGuard();

  const {_t} = useLang();
  const mainTabList = useMemo(
    () =>
      [
        {
          tabLabel: _t('210d816feb744000a573'),
          itemKey: MAIN_TAB_KEYS.home,
          screen: Home,
        },
        // 接口拉取有带单员身份 || 申请交易员成功页面都展示 带单员 tab
        isLeadTrader && {
          tabLabel: _t('04b9d3a78ebd4000a68e'),

          itemKey: MAIN_TAB_KEYS.myLeading,
          screen: MyLeading,
        },
        {
          tabLabel: _t('e707b0302ecd4000a1eb'),
          itemKey: MAIN_TAB_KEYS.myCopies,
          screen: MyCopies,
        },
      ].filter(i => !!i),
    [_t, isLeadTrader],
  );

  // 首次拉取母账户存在带单子账户时 兜底ios 拉取app 带单子账户信息
  useEffect(() => {
    if (isLeadTrader !== true || isAndroid) {
      return;
    }
    requestRefreshCopyTradingAccountInfo();
  }, [isLeadTrader]);
  return mainTabList;
};
