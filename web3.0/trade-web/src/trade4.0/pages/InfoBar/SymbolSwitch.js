/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-15 16:33:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-11 09:58:23
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/SymbolSwitch.js
 * @Description:
 */
import React, { useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { useResponsive } from '@kux/mui';
import Dropdown from '@mui/Dropdown';
import SymbolFlag from '@/components/SymbolFlag';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import { _t } from 'utils/lang';
import { styled } from '@/style/emotion';
import TokenInfoIcon from './TokenInfoIcon';
import { useGaExpose } from 'utils/ga';
import SvgComponent from 'src/trade4.0/components/SvgComponent';
import useSensorFunc from '@/hooks/useSensorFunc';
import { FUTURES, isFuturesNew } from '@/meta/const';
import { transformSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import StTag from '@/components/StTag';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { LazyImage } from '@/components/LazyBackground';
import SettleDateTip from '@/pages/Futures/components/SettleDateTip/SettleDateTip';

import loadable from '@loadable/component';
import { useReset } from '../NewMarkets/components/Search/useChange';
import { MARKET_INIT_EVENT } from '../NewMarkets/config';
import { useResetSubscribe } from '../NewMarkets/components/Content/hooks/useList';
import { event } from 'src/trade4.0/utils/event';

const NewMarkets = loadable(() =>
  import(/* webpackChunkName: 'new-markets' */ '@/pages/NewMarkets'),
);
const Markets = loadable(() => import(/* webpackChunkName: 'new-markets' */ '@/pages/Markets'));

export const HookContext = React.createContext(() => {});

const SelectSymbolStyled = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  padding: 0 12px 0 0;
  height: fit-content;
  width: max-content;
  //position: relative;
  cursor: pointer;

  .st {
    margin-left: 2px;
    display: inline-flex;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0;
    align-items: end;
  }

  &.active {
    &::after {
      transform: rotate(180deg);
    }
  }
  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    right: 8px;
    margin-top: -2px;
    width: 0;
    height: 0;
    transition: transform 0.3s;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }
`;

const H1Tag = styled.h1`
  margin: 0;
  padding: 0;
  font-weight: 500;
  font-size: 16px;
  display: inline-block;
  margin-left: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 0px;
    font-size: 12px;
    color: ${(props) => props.theme.colors.text40};
    .symbolCodeToName {
      font-size: 16px;
      color: ${(props) => props.theme.colors.text};
      display: block;
      font-weight: 600;
    }
    /* svg {
      margin-top: -5px;
    } */
  }
`;

const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  .KuxDropDown-popper {
    inset: auto !important;
    transform: none !important;
    left: 0px !important;
    bottom: 0px !important;
    top: ${(props) => props.overlayTop}px !important;
    ${(props) => props.theme.breakpoints.down('xl')} {
      top: 48px !important;
    }
  }
`;

const MarketsDrop = styled.div`
  color: ${(props) => props.theme.colors.text};
  z-index: 999;
  width: 480px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    height: 100%;
  }
  .KuxTabs-scrollButton {
    background: ${(props) => props.theme.colors.layer};
  }

  ${(props) =>
    props.theme.currentTheme === 'dark' &&
    `
      .KuxTabs-rightScrollButtonBg {
    background: none;
      }
      .KuxTabs-leftScrollButtonBg {
    background: none;
      }
     `}

  .markets {
    background-color: ${(props) => props.theme.colors.layer};
    border-radius: 4px;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 8px 0px 24px rgba(0, 0, 0, 0.16);
    .symbol-pair {
      font-size: 14px;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      border-radius: 0px;
    }
  }
  .KuxSpin-container {
    &::after {
      background: ${(props) => props.theme.colors.layer};
    }
  }
`;

const SvgComponentTransform = styled(SvgComponent)`
  flex: 0 0 auto;
  transition: transform 0.5s;
  ${(props) => {
    if (props.visible) {
      return 'transform: rotate(180deg);';
    }
  }}
  ${(props) => {
    if (!props.sm) {
      return `
        margin-top: 5px;
        align-self: start;
    `;
    }
  }}
`;

const Header = ({ tradeType, currentSymbol, iconUrl, coinInfo }) => {
  const ref = useRef();
  const [visible, setVisible] = React.useState(false);
  const [overlayTop, setOverlayTop] = React.useState(99);
  const { sm, xl } = useResponsive();
  const sensorFunc = useSensorFunc();
  const { mark } = useGetCurrentSymbolInfo();
  const { reset } = useReset();
  const { reSubscribe } = useResetSubscribe();

  const calc = useCallback(() => {
    try {
      const { top, height } = ref.current.getBoundingClientRect();
      // 48: InfoBar的高度
      const nextOverlayTop = Math.round(top + height + (48 - height) / 2);
      setOverlayTop(nextOverlayTop);
    } catch (e) {
      setOverlayTop(99);
    }
  }, []);

  const handleDropdown = useCallback(
    (v) => {
      if (v) {
        if (xl) {
          calc();
        }
        sensorFunc(['tokenInformation', 'symbolSwitch', 'click'], currentSymbol);
      }
      setVisible(v);
    },
    [calc, currentSymbol, sensorFunc, xl],
  );

  // 埋点
  const gaConf = useMemo(() => {
    return {
      data: {
        symbol: currentSymbol,
      },
    };
  }, [currentSymbol]);
  useGaExpose('symbolZone', gaConf);

  useEffect(() => {
    // 打开的时候，当行情列表是业务类型的时候，
    // 需要定位到对应的交易类型的tab
    if (visible && isFuturesNew()) {
      event.emit(MARKET_INIT_EVENT);
    }
    // 关闭且是合约， 两个market同时出现，特殊处理
    if (!visible && isFuturesNew()) {
      // 重制数据
      reset();
      // 重制滚动条，触发一下renderChange
      reSubscribe();
    }
  }, [reSubscribe, reset, visible]);

  const overlay = useMemo(() => {
    // const isKumexNew = isFuturesNew();
    return (
      <HookContext.Provider value={setVisible}>
        <MarketsDrop>
            <NewMarkets key="switch-markets" isSwitch fallback={<div />} />
        </MarketsDrop>
      </HookContext.Provider>
    );
  }, []);

  const SelectSymbol = useMemo(() => {
    return (
      <SelectSymbolStyled className="symbol-style">
        {!sm ? null : <LazyImage width={20} height={20} src={iconUrl} key={currentSymbol} />}
        <H1Tag>
          {!sm ? (
            <Fragment>
              <SymbolCodeToName
                isNotWrap={false}
                boxClassName="symbol-select"
                symbolClassName="symbol-name"
                typeClassName="symbol-type"
                code={currentSymbol}
                tradeType={tradeType}
              />
              <SymbolFlag symbol={currentSymbol} type={tradeType} />
            </Fragment>
          ) : (
            <SymbolCodeToName code={currentSymbol} tradeType={tradeType} />
          )}
          {sm ? <SettleDateTip symbol={currentSymbol} /> : null }
        </H1Tag>
        {!sm ? null : <SymbolFlag symbol={currentSymbol} type={tradeType} />}
        {mark === 1 && (
          <span className="st">
            <StTag />
          </span>
        )}
        <SvgComponentTransform
          color={'transparent'}
          type={'circle-arrow-down'}
          size={16}
          visible={visible}
          className="ml-8"
          sm={sm}
        />
      </SelectSymbolStyled>
    );
  }, [sm, iconUrl, currentSymbol, tradeType, mark, visible]);

  const coinInfoTab = useMemo(() => {
    return (
      <DropdownWrapper className="ticker-left" ref={ref} overlayTop={overlayTop}>
        <Dropdown
          trigger="click"
          visible={visible}
          contentPadding={0}
          title={_t('market')}
          anchorProps={{ style: {} }}
          onVisibleChange={handleDropdown}
          overlay={overlay}
        >
          {SelectSymbol}
        </Dropdown>
        {!sm ? null : (
          <TokenInfoIcon
            symbol={coinInfo.coin}
            resetOverLayTop={calc}
            type={coinInfo.currencyType}
          />
        )}
      </DropdownWrapper>
    );
  }, [
    overlayTop,
    visible,
    handleDropdown,
    overlay,
    SelectSymbol,
    sm,
    coinInfo.coin,
    coinInfo.currencyType,
    calc,
  ]);

  return <React.Fragment>{coinInfoTab}</React.Fragment>;
};

export default connect((state) => {
  const { symbolsMap } = state.symbols;
  const { tradeType, currentSymbol } = state.trade;
  const [coin] = currentSymbol.split('-');
  let coinInfo = state.categories[coin] || {};
  let iconUrl = coinInfo.iconUrl;
  // 合约融合
  const isFutures = tradeType === FUTURES;
  const futuresDict = state.symbols?.futuresSymbolsMap || {};
  if (isFutures) {
    const symbolInfo = transformSymbolInfo(futuresDict[currentSymbol] || {});
    const base = symbolInfo.baseCurrency;
    coinInfo = state.categories[base] || {};
    iconUrl = symbolInfo.imgUrl || coinInfo.iconUrl;
  }
  return {
    iconUrl,
    tradeType,
    symbolsMap,
    currentSymbol,
    coinInfo,
  };
})(React.memo(Header));
