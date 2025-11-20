/*
 * owner: borden@kupotech.com
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { styled, useTheme, useResponsive } from '@kux/mui';
import { ICNotificationOutlined } from '@kux/icons';
import { useDispatch, useSelector } from 'dva';
import { useLocation } from 'react-router-dom';
import some from 'lodash/some';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import NoticeBar from '@/components/NoticeBar';
import systemDynamic from 'utils/systemDynamic';
import { isFromTMA } from 'utils/tma/isFromTMA';
import { siteCfg as HOST } from 'config';
import { isShowMaintenanceNotice } from 'utils/noticeUtils';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';

const RemoteHeader = systemDynamic('@kucoin-biz/header', 'Header');

// 停机通知最多显示的范围-主站（首页/行情（trade-web）/交易/资产）
const maintainancePath = [
  // { path: '/', code: 'Index' },
  // { path: '/markets', code: 'Quotes' },
  // { path: '/assets', code: 'Assets' },
  { path: '/trade', code: 'Trade' },
];

const Container = styled.header`
  // height: 48px;
  min-height: 48px;
  display: flex;
  // font-size: 30px;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    border-bottom: 1px solid ${(props) => props.theme.colors.cover8};
  }
  // color: ${(props) => props.theme.colors.text};
  // background: ${(props) => props.theme.colors.overlay};

  // 交易Header的位置，交给Layout层管控，不需要通过fixed定位处理
  .gbiz-Header {
    position: static;
    z-index: unset;
  }
  .gbiz-headeroom {
    position: static;
    z-index: unset;
  }
`;

const StyleNotice = styled.span(({ theme }) => ({
  width: '32px',
  height: '32px',
  background: theme.colors.cover4,
  marginLeft: '-12px',
  borderRadius: '50%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '32px',
  fontSize: '14px',
  '&:hover': {
    '& svg': {
      fill: theme.colors.primary,
    },
  },
  '[dir="rtl"] &': {
    marginLeft: '0px',
  },
}));

const StyleCount = styled.span(({ theme, width, borderRadius }) => ({
  position: 'absolute',
  top: '-3px',
  left: '30px',
  height: 16,
  borderRadius,
  border: `1px solid ${theme.colors.background}`,
  width,
  background: theme.colors.primary,
  color: theme.colors.textEmphasis,
  padding: '0 4px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 600,
  fontSize: 10,
  zoom: 0.85,
  [theme.breakpoints.down('sm')]: {
    top: '-6px',
    left: '26px',
  },
}));

// const StyledButton = styled(Button)`
//   margin-left: 40px;
// `;
const Header = React.memo(() => {
  const { pathname } = useLocation();
  const [closeMaintenance, setCloseMaintenance] = useState(false);
  const currentLang = useSelector((state) => state.app.currentLang);

  const currency = useSelector((state) => state.currency.currency);
  const rates = useSelector((state) => state.currency.rates);
  const user = useSelector((state) => state.user.user);
  const count = useSelector((state) => state.notice_event.count);
  const currentSymbol = useGetCurrentSymbol();
  // const maintenanceStatus = useSelector(
  //   (state) => state.notice_event.maintenanceStatus || state.tradeForm?.maintenanceStatus,
  // );
  const maintenanceStatus = useSelector((state) => state.tradeForm?.maintenanceStatus);

  const showMaintenance = useMemo(() => {
    return isShowMaintenanceNotice(location.pathname, maintenanceStatus, currentSymbol);
  }, [maintenanceStatus, currentSymbol]);
  const coinDict = useSelector((state) => state.categories.coinDict);
  // const { colors } = theme;
  const { isHFAccountExist } = useSelector((state) => state.user_assets);
  // const noticeVisible = useSelector((state) => state.notice_event.barVisible);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { setTheme, currentTheme, colors } = theme;

  useEffect(() => {
    if (user) {
      dispatch({ type: 'notice_event/fetch' });
    }
  }, [dispatch, user]);

  const onCurrencyChange = (c) => {
    dispatch({ type: 'currency/selectCurrency', payload: { currency: c } });
    // 更换法币类型时，重新拉取数字货币对应法币的汇率
    dispatch({ type: 'currency/pullPrices', payload: { currency: c } });
  };

  const onLangChange = (l) => {
    dispatch({
      type: 'app/selectLang',
      payload: {
        lang: l,
        reload: true,
      },
    });
  };

  // const backOldVersion = () => {
  //   dispatch({
  //     type: 'app/changeUseNewIndexConfig',
  //     payload: {
  //       isUseNewIndex: false,
  //     },
  //   });
  // };

  const onShowNotice = () => {
    dispatch({
      type: 'notice_event/update',
      payload: { barVisible: true },
    });
  };

  const onCloseMaintenance = useCallback(() => {
    dispatch({
      type: 'notice_event/update',
      payload: {
        showMaintenance: false,
      },
    });
    setCloseMaintenance(true);
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

  const noticeCountStyle = useMemo(() => {
    if (count < 10) {
      return {
        width: 16,
        borderRadius: '50%',
      };
    }
    if (count <= 99) {
      return {
        width: 22,
        borderRadius: 8,
      };
    }
    if (count > 99) {
      return {
        width: 28,
        borderRadius: 12,
      };
    }
    return {
      width: 16,
      borderRadius: '50%',
    };
  }, [count]);

  const notice = user ? (
    <StyleNotice onClick={onShowNotice} theme={theme}>
      <ICNotificationOutlined size={16} color={colors.text} />
      {+count ? (
        <StyleCount {...noticeCountStyle} theme={theme}>
          {count > 99 ? '99+' : count}
        </StyleCount>
      ) : null}
    </StyleNotice>
  ) : null;
  const menuConfig = [
    'asset',
    'order',
    'person',
    'search',
    notice,
    'download',
    'i18n',
    'currency',
    'theme',
  ];
  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    KUCOIN_HOST_CHINA: HOST.KUCOIN_HOST_CHINA, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: '/_api', // kucoin主站API地址
    KUMEX_BASIC_HOST: HOST.KUMEX_BASIC_HOST, // KuMEX简约版地址
    FASTCOIN_HOST: HOST.FASTCOIN_HOST, // 一键买币地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
  };
  const maintenanceConfig = {
    maintenance: maintenanceStatus,
    maintainancePath,
    showMaintenance: showMaintenance && !closeMaintenance,
    pathname: '/trade',
  };

  const { open } = useLoginDrawer();
  const { sm } = useResponsive();
  // const isLogin = useSelector(state => !!state.user.isLogin);

  const handleTheme = (changedTheme) => {
    setTheme(changedTheme);
    dispatch({
      type: 'setting/toggleTheme',
    });
  };

  if (isFromTMA() && !sm) {
    return <NoticeBar />;
  }

  return (
    <Container data-inspector="tradeV4_header">
      <RemoteHeader
        mainTheme={currentTheme}
        currentLang={currentLang}
        currency={currency}
        userInfo={user}
        isHFAccountExist={isHFAccountExist}
        coinDict={coinDict}
        // hostConfig={HOST}
        theme={currentTheme}
        onThemeChange={handleTheme}
        transparent={false}
        onCurrencyChange={onCurrencyChange}
        onCloseMaintenance={onCloseMaintenance}
        onLangChange={onLangChange}
        menuConfig={menuConfig}
        outerCurrencies={rates}
        inTrade
        customLogin={open} // 自定义登录动作，需要g-biz把登录操作放出来
        {...maintenanceConfig}
        {...hostConfig}
      />
      <NoticeBar />
    </Container>
  );
});

export default Header;
