/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import loadable from '@loadable/component';
import config from 'config';
import useLocaleChange from 'hooks/useLocaleChange';
import { some } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { push } from 'utils/router/index';
import HOST from 'utils/siteConfig';
import Header from './RemoteHeader';

const NoticeCenter = loadable(() => System.import('@kucoin-biz/notice-center'), {
  resolveComponent: (module) => {
    module.pushTool.setPush(push);
    return module.NoticeCenter;
  },
});

const { v2ApiHosts } = config;

// 停机通知最多显示的范围-主站（首页/行情（trade-web）/交易/资产）
const maintainancePath = [
  { path: '/', code: 'Index' },
  { path: '/markets', code: 'Quotes' },
  { path: '/assets', code: 'Assets' },
];

const NewHeader = ({ pathname, topInsertRender } = {}) => {
  const { currentLang } = useLocale();
  const changeLocale = useLocaleChange();
  const currency = useSelector((state) => state.currency.currency);
  const rates = useSelector((state) => state.currency.rates);
  const user = useSelector((state) => state.user.user);
  const maintenanceStatus = useSelector((state) => state.notice_event.maintenanceStatus);
  const showMaintenance = useSelector((state) => state.notice_event.showMaintenance);
  const coinDict = useSelector((state) => state.categories.coinDict);
  const { isHFAccountExist } = useSelector((state) => state.user_assets);
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const isSupportSwithTheme = useSelector((state) => state.setting.isSupportSwithTheme);
  // const noticeVisible = useSelector((state) => state.notice_event.barVisible);
  const dispatch = useDispatch();

  const onCurrencyChange = (c) => {
    dispatch({ type: 'currency/selectCurrency', payload: { currency: c } });
    // 更换法币类型时，重新拉取数字货币对应法币的汇率
    dispatch({ type: 'currency/pullPrices', payload: { currency: c } });
  };

  const onLangChange = (l) => {
    changeLocale(l);
  };

  const onCloseMaintenance = useCallback(() => {
    dispatch({
      type: 'notice_event/update',
      payload: {
        showMaintenance: false,
      },
    });
  }, [dispatch]);
  useEffect(() => {
    if (some(maintainancePath, ({ path }) => path === pathname)) {
      dispatch({
        type: 'notice_event/queryMaintenanceStatus',
        currentLang,
      });
    }
  }, [pathname, dispatch, currentLang]);
  // const backBtn = (
  //   <div
  //     data-ga="ind_nav_old"
  //     onClick={backOldVersion}
  //     // className="navUserItem"
  //   >
  //     {_t('nav.return.old')}
  //   </div>
  // );

  useEffect(() => {
    if (!user) {
      return;
    }
    dispatch({ type: 'user_assets/queryUserHasHighAccount' });
  }, [dispatch, user]);

  const themeSwith = isSupportSwithTheme ? 'theme' : null;

  const notice = user ? <NoticeCenter theme={currentTheme} /> : null;

  const menuConfig = [
    'asset',
    'order',
    'person',
    'search',
    notice,
    'download',
    'i18n',
    'currency',
    themeSwith,
  ];
  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    KUCOIN_HOST_CHINA: HOST.KUCOIN_HOST_CHINA, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: v2ApiHosts.CMS, // kucoin主站API地址
    KUMEX_BASIC_HOST: HOST.KUMEX_BASIC_HOST, // KuMEX简约版地址
    FASTCOIN_HOST: HOST.FASTCOIN_HOST, // 一键买币地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
  };
  const maintenanceConfig = {
    maintenance: maintenanceStatus,
    maintainancePath,
    showMaintenance,
  };

  const onThemeChange = useCallback(
    (changedTheme) => {
      dispatch({
        type: 'setting/toggleTheme',
        payload: {
          theme: changedTheme,
        },
      });
    },
    [dispatch],
  );

  return (
    <Header
      currentLang={currentLang}
      currency={currency}
      userInfo={user}
      isHFAccountExist={isHFAccountExist}
      coinDict={coinDict}
      theme={currentTheme}
      // hostConfig={HOST}
      transparent={false}
      onCurrencyChange={onCurrencyChange}
      onCloseMaintenance={onCloseMaintenance}
      onLangChange={onLangChange}
      onThemeChange={onThemeChange}
      menuConfig={menuConfig}
      pathname={pathname}
      outerCurrencies={rates}
      {...maintenanceConfig}
      {...hostConfig}
      topInsertRender={topInsertRender}
    />
  );
};

export default React.memo(NewHeader);
