/**
 * Owner: garuda@kupotech.com
 */
import React, { Fragment, useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { commonSensorsFunc } from '@/meta/sensors';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { useResponsive, useTheme } from '@kux/mui';
import Button from '@mui/Button';
import { _t, _tHTML, addLangToPath } from 'utils/lang';
import { siteCfg } from 'config';
import { multiply, numberFixed, dropZero, evtEmitter } from 'helper';
import { getMarginDataUrl, getSpotAndMarginAPIUrl } from '@/meta/link';
import { EVENT_DIALOG_NAME, EVENT_DRAWER_NAME, TYPES_ENUM } from './config';
import SuspensionDark from '@/assets/toolbar/suspension_dark.png';
import SuspensionLight from '@/assets/toolbar/suspension_light.png';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES, ISOLATED, SPOT, isABNew } from 'src/trade4.0/meta/const';
import { getCrossRiskLimitUrl, getIsolatedRiskLimitUrl } from 'src/trade4.0/meta/link';
import sessionStorage from 'src/utils/sessionStorage';
import CompliantBox from 'src/trade4.0/components/CompliantRule/index.js';

const { LANDING_HOST, MAINSITE_HOST } = siteCfg;

const toPercent = (num) => {
  return dropZero(multiply(num || 0, 100));
};

const goPageVipLevel = () => {
  window.open(addLangToPath(`${MAINSITE_HOST}/vip/privilege`));
};

const openUrl = (url) => {
  const newWindow = window.open(url);
  newWindow.opener = null;
};

const ChangeVersionTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 8px;
`;

const ChangeVersionContent = styled.div`
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const eventHandle = evtEmitter.getEvt('trade-information');

export const useItemClick = () => {
  const tradeType = useTradeType();
  const isSpot = tradeType === SPOT;

  const onItemClick = useCallback((type) => {
    commonSensorsFunc(['tradeZoneFunctionArea', type, 'click']);
    // 如果是第四项，也就是交易基础信息，展示抽屉（如果当前是）
    if (type === TYPES_ENUM.BASIC) {
      eventHandle.emit(EVENT_DRAWER_NAME, type);
      return;
    }
    if (type === TYPES_ENUM.MARGIN_DATA) {
      openUrl(getMarginDataUrl());
      return;
    }
    if (type === TYPES_ENUM.API) {
      openUrl(getSpotAndMarginAPIUrl(isSpot));
      return;
    }
    eventHandle.emit(EVENT_DIALOG_NAME, type);
  }, [isSpot]);
  return onItemClick;
};

export const useInformationDialog = () => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const baseInfo = useSelector((state) => state.homepage.baseInfo);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const feeInfoMap = useSelector((state) => state.tradeForm.feeInfoMap);
  const dispatch = useDispatch();
  const theme = useTheme();
  const tradeType = useTradeType();

  const isFutures = tradeType === FUTURES;
  const isIsolated = tradeType === ISOLATED;

  const changeVersionButtonCallback = useCallback(() => {
    if (isFutures) {
      window.open(addLangToPath(`/futures/trade/${currentSymbol}`));
      return;
    }
    if (isABNew()) {
      commonSensorsFunc(['tradeZoneFunctionArea', 'triggerVersion', 'click']);
      sessionStorage.setItem('CUSTOM_OLD_VERSION', true);
      window.location.reload(true);
    }
  }, [isFutures, currentSymbol]);

  const [dialogProps, setDialogProps] = useState({
    visible: false,
    payload: {},
  });

  const {
    makerFeeRate = 0,
    takerFeeRate = 0,
    makerFeeCoefficient = 0,
    takerFeeCoefficient = 0,
  } = symbolsMap[currentSymbol] || {};

  const { takerFeeRate: symbolTakerFeeRate, makerFeeRate: symbolMakerFeeRate } =
    feeInfoMap[currentSymbol] || {};
  const { userLevel } = baseInfo;
  const _currentSymbol = currentSymbol.replace('-', '/');

  const mkerFee = numberFixed(multiply(makerFeeRate || 0, makerFeeCoefficient));
  const tkerFee = numberFixed(multiply(takerFeeRate || 0, takerFeeCoefficient));

  const DIALOG_CONTENT = useMemo(
    () => {
      const riskLimitUrl = isIsolated ? getIsolatedRiskLimitUrl() : getCrossRiskLimitUrl();
      return {
        RATE: {
          title: _t('tradeForm.feeRemark.title'),
          url: addLangToPath(`${MAINSITE_HOST}/vip/privilege`),
          content: isLogin ? (
            <Fragment>
              <p>
                {_t('tradeForm.feeRemark.desc1', {
                  symbol: _currentSymbol,
                  taker: `${toPercent(tkerFee)}%`,
                  maker: `${toPercent(mkerFee)}%`,
                })}
              </p>
              <CompliantBox ruleId={'TRADE_TOOLBAR_TAX_LEVELINFO'}>
                <p>
                  {_t('tradeForm.feeRemark.desc2', {
                    level: userLevel,
                    symbol: _currentSymbol,
                    maker: `${toPercent(symbolMakerFeeRate || 0)}%`,
                    taker: `${toPercent(symbolTakerFeeRate || 0)}%`,
                  })}
                </p>
                <Button variant="text" onClick={goPageVipLevel}>
                  {_t('tradeForm.feeRemark.link')}
                </Button>
              </CompliantBox>
            </Fragment>
          ) : (
            <div>{_t('tradeForm.kcs.preferential')}</div>
          ),
        },
        PRICE: {
          title: _t('3TZ8uXEjttkbDu8NFjwcYh'),
          url: addLangToPath(`${LANDING_HOST}/price-protect?type=contract`),
          content: (
            <Fragment>
              {_tHTML('priceProtect.contract.guide', {
                host: addLangToPath(LANDING_HOST),
              })}
            </Fragment>
          ),
        },
        LIMIT: {
          title: _t('6XuGzZ7ZwVtcHe5au5wzse'),
          url: riskLimitUrl,
          content: (
            <Fragment>
              {_tHTML('c1f256aa77634000a3f6', {
                a: riskLimitUrl,
              })}
            </Fragment>
          ),
        },
        CHANGEVERSION: {
          title: null,
          okText: _t('muQZf9Q8gQrCJhRb83yTtS'),
          cancelText: _t('9tKmfLcAqNjiQJrLG1tBPo'),
          showCloseX: false,
          header: null,
          centeredFooterButton: true,
          onCancel: changeVersionButtonCallback,
          content: (
            <Fragment>
              <div className="flex khc mt-32 mb-8">
                <img
                  width="148px"
                  height="148px"
                  src={theme.currentTheme === 'dark' ? SuspensionDark : SuspensionLight}
                />
              </div>
              <ChangeVersionTitle className="flex khc">
                {_t('2NhafWBX6oUyVhSmRCNuWA')}
              </ChangeVersionTitle>
              <ChangeVersionContent className="flex khc">
                {_t('imr49mgstPmW7MiN3xuJy9')}
              </ChangeVersionContent>
            </Fragment>
          ),
        },
      };
    },
    [
      isLogin,
      _currentSymbol,
      tkerFee,
      mkerFee,
      userLevel,
      symbolMakerFeeRate,
      symbolTakerFeeRate,
      changeVersionButtonCallback,
      theme,
      isIsolated,
    ],
  );

  const handleOpenDialog = useCallback(
    (type) => {
      // 交易信息专用接口
      if (type === TYPES_ENUM.RATE && isLogin) {
        dispatch({
          type: 'homepage/getUserOverviewInfo',
        });
      }

      setDialogProps({
        visible: true,
        payload: DIALOG_CONTENT[type] || {},
      });
    },
    [DIALOG_CONTENT, dispatch, isLogin],
  );

  useEffect(() => {
    eventHandle.on(EVENT_DIALOG_NAME, handleOpenDialog);
    return () => {
      eventHandle.off(EVENT_DIALOG_NAME, handleOpenDialog);
    };
  }, [handleOpenDialog]);
  return [dialogProps, setDialogProps];
};

export const useInformationDrawer = () => {
  const { sm } = useResponsive();

  const dispatch = useDispatch();

  const [tradeBasicInfo, setTradeBasicInfo] = useState({});

  const [basicInformationDrawerVisible, setBasicInformationDrawerVisible] = useState(false);
  useEffect(() => {
    if (basicInformationDrawerVisible) {
      dispatch({
        type: 'symbols/getTradeBasicInfo',
      }).then((data) => {
        setTradeBasicInfo(data);
      });
    }
  }, [basicInformationDrawerVisible, dispatch]);

  const dialogResponsiveProp = useMemo(
    () =>
      (sm
        ? {
            anchor: 'right',
            width: 480,
          }
        : {
            anchor: 'bottom',
          }),
    [sm],
  );

  const { symbol = '' } = useGetCurrentSymbolInfo();
  const [coin, pair] = symbol.split('-');

  const handleOpenDrawer = useCallback(() => {
    setBasicInformationDrawerVisible(true);
  }, []);

  useEffect(() => {
    eventHandle.on(EVENT_DRAWER_NAME, handleOpenDrawer);
    return () => {
      eventHandle.off(EVENT_DRAWER_NAME, handleOpenDrawer);
    };
  }, [handleOpenDrawer]);

  return {
    basicInformationDrawerVisible,
    setBasicInformationDrawerVisible,
    dialogResponsiveProp,
    sm,
    coin,
    pair,
    tradeBasicInfo,
  };
};
