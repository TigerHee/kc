/**
 * Owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import { includes } from 'lodash';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import { siteCfg } from 'config';
import { isFuturesNew } from '@/meta/const';
import { _t, addLangToPath } from 'src/utils/lang';
import { isRTLLanguage } from 'src/utils/langTools';
import { trackClick, addSpmIntoQuery } from 'src/utils/ga';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { openPage } from '../../../utils';
import { FUTURES } from 'src/paths';
import { getFuturesPath } from '@/utils/path';

// 是否显示活动入口
const kumexTradeBtnSpm = ['shiftCategory', '3'];
const kumexActivityUrlWithSpm = `${siteCfg.KUMEX_HOST}/activity`;

export const showActivity = false;

export default function useStateAndLogic() {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const currentSymbol = useGetCurrentSymbol();
  const isLogin = useSelector((state) => Boolean(state.user.isLogin));
  const kumexOpenFlag = useSelector((state) => state.overview.kumexOpenFlag);
  const currentLang = useSelector((state) => state.app.currentLang);

  const isRtl = isRTLLanguage();
  const isCn = includes(currentLang, 'zh_');
  const futuresNew = isFuturesNew();
  const { symbol: contractName } = isFuturesNew()
    ? getFuturesPath(currentSymbol)
    : { symbol: 'XBTUSDTM' };

  const suffix = `-${currentTheme}${showActivity && isCn ? '-zh' : isRtl ? '-rtl' : ''}`;

  const jumpUrl = addLangToPath(
    showActivity
      ? kumexActivityUrlWithSpm
      : addSpmIntoQuery(
          `${siteCfg.KUMEX_HOST}/trade/${contractName}?isQuickOrder=true&utm_source=SpotToFutures`,
          kumexTradeBtnSpm,
        ),
  );
  const showUrl = addLangToPath(
    showActivity
      ? kumexActivityUrlWithSpm
      : futuresNew
      ? `${siteCfg.MAINSITE_HOST}/trade/futures/${contractName}`
      : `${siteCfg.KUMEX_HOST}/trade/${contractName}?isQuickOrder=true`,
  );

  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'overview/checkKumexIsOpen',
      });
    }
  }, [dispatch, isLogin]);

  const onClick = (e) => {
    e.preventDefault();
    trackClick(kumexTradeBtnSpm);

    if (futuresNew) {
      dispatch(routerRedux.push(`${FUTURES}/${contractName}`));
    } else {
      openPage(jumpUrl);
    }
  };

  return {
    showUrl,
    onClick,
    kumexOpenFlag,
    iconProps: {
      height: 16,
      keepOrigin: true,
      fileName: 'orderForm',
      // width: showActivity ? 58 : 45,
      width: 45,
      type: showActivity ? `futures-activity${suffix}` : `futures-bonus${suffix}`,
    },
  };
}
