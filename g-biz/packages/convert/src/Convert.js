/*
 * @owner: borden@kupotech.com
 */
import { isFunction } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import loadable from '@loadable/component';
import { useTranslation } from '@tools/i18n';
import { ICHistoryOutlined } from '@kux/icons';
import { useDispatch, useSelector } from 'react-redux';
import { styled, useSnackbar, useLatest, useResponsive } from '@kux/mui';
import { exposeGbizStateForSSG } from '@tools/exposeGbizStateForSSG';
import useContextSelector from './hooks/common/useContextSelector';
import useIsSymbolDisabled from './hooks/form/useIsSymbolDisabled';
import GlobalStyle from './components/common/GlobalStyle';
import TaxInfoCollectDialog from './modules/TaxInfoCollectDialog';
import FundingAccount from './modules/FundingAccount';
import OrderTypeTabs from './modules/OrderTypeTabs';
import { NAMESPACE, ORDER_TYPE_MAP, ORDER_TYPE_ENUM } from './config';
import withWrapper from './hocs/withWrapper';
import withAuth from './hocs/withAuth';
import { getInnerUrl } from './utils/tools';
import useInit from './hooks/form/useInit';
import Notice from './modules/Notice';
import { useFromCurrency, useToCurrency } from './hooks/form/useStoreValue';

const MaintenanceMask = loadable(() => import('./modules/MaintenanceMask'));
const RestrictedDialog = loadable(() => import('./modules/RestrictedDialog'));
const AgreeDialogRender = loadable(() => import('./modules/AgreeDialogRender'));

const Content = styled.div`
  position: relative;
  min-height: 350px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-height: 320px;
  }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
  }
`;
const HistoryLink = withAuth(styled.a`
  margin-left: 16px;
  &,
  &:hover {
    color: ${(props) => props.theme.colors.icon} !important;
  }
`);

const CurrencyChange = ({ onChange }) => {
  const latestOnChange = useLatest(onChange);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();

  useEffect(() => {
    latestOnChange.current(`${fromCurrency}-${toCurrency}`);
  }, [fromCurrency, latestOnChange, toCurrency]);

  return null;
};

// 交易对禁用的提示信息
const SymbolDisabledMessage = React.memo(() => {
  const { message } = useSnackbar();
  const { t: _t } = useTranslation('convert');
  const isSymbolDisabled = useIsSymbolDisabled();

  useEffect(() => {
    if (isSymbolDisabled) {
      message.info(_t('05cfc59438414000acf6'));
    }
  }, [isSymbolDisabled]);

  return null;
});

export const ConvertForm = React.memo((props) => {
  const { inDialog, visible, ...otherProps } = props;

  const dispatch = useDispatch();
  const isLogin = useContextSelector((state) => Boolean(state.user));
  const onSymbolChange = useContextSelector((state) => state.onSymbolChange);
  const baseConvertConfig = useContextSelector((state) => state.baseConvertConfig);
  const kyc3TradeLimitInfo = useSelector((state) => state[NAMESPACE].kyc3TradeLimitInfo);
  const orderType = useSelector((state) => state[NAMESPACE].orderType);

  const isOpenConvert = baseConvertConfig?.downtime === false;

  const Component = useMemo(() => {
    return ORDER_TYPE_MAP[orderType].Component || ORDER_TYPE_MAP[ORDER_TYPE_ENUM.MARKET].Component;
  }, [orderType]);

  useEffect(() => {
    if (visible && isOpenConvert) {
      const effectName = ORDER_TYPE_MAP[orderType]?.queryCurrencyListEffectName;
      if (!effectName) return;
      dispatch({
        type: `${NAMESPACE}/${effectName}`,
        // isInit: true,
      });
    }
  }, [dispatch, visible, orderType, isOpenConvert]);

  useEffect(() => {
    if (visible && isOpenConvert) {
      if (isLogin) {
        const effectName = ORDER_TYPE_MAP[orderType]?.pullPositionEffectName;
        if (!effectName) return;
        dispatch({
          type: `${NAMESPACE}/${effectName}`,
        });
      } else {
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: {
            positions: null,
          },
        });
      }
    }
  }, [dispatch, isLogin, visible, isOpenConvert, orderType]);

  return (
    <>
      <GlobalStyle containerSelector={`.${NAMESPACE}`} />
      {/* 在弹窗中不展示公告 */}
      {!inDialog && <Notice />}
      {!ORDER_TYPE_MAP[orderType].hideFundingAccount && <FundingAccount />}
      <Content>
        <Component visible={visible} {...otherProps} />
      </Content>
      {baseConvertConfig?.downtime === true && <MaintenanceMask />}
      {isFunction(onSymbolChange) && <CurrencyChange onChange={onSymbolChange} />}
      {Boolean(kyc3TradeLimitInfo) && <RestrictedDialog {...kyc3TradeLimitInfo} />}
      {Boolean(isLogin) && (
        <>
          <TaxInfoCollectDialog />
          <SymbolDisabledMessage />
        </>
      )}
    </>
  );
});

const Convert = React.memo(
  ({
    style,
    defaultOrderType,
    defaultToCurrency,
    disabledOrderTypes,
    defaultFromCurrency,
    ...otherProps
  }) => {
    const { sm } = useResponsive();
    const isLogin = useContextSelector((state) => Boolean(state.user));
    const orderType = useSelector((state) => state[NAMESPACE].orderType);

    useInit({ defaultOrderType, defaultToCurrency, defaultFromCurrency });

    useEffect(() => {
      exposeGbizStateForSSG((dvaState, commonState) => {
        const data = dvaState[NAMESPACE].convertSymbolsMap?.[ORDER_TYPE_ENUM.MARKET];
        commonState[NAMESPACE] = {
          convertSymbolsMap: {
            [ORDER_TYPE_ENUM.MARKET]: {
              usdtCurrencyLimitMap: {
                BTC: data?.usdtCurrencyLimitMap?.BTC || {},
              },
              normalCurrencyLimitMap: {
                BTC: data?.normalCurrencyLimitMap?.BTC || {},
              },
            },
          },
        };
      });
    }, []);

    if (!ORDER_TYPE_MAP[orderType]) return null;
    return (
      <div className={NAMESPACE} style={{ position: 'relative', ...style }} {...otherProps}>
        <Header>
          <OrderTypeTabs disabledOrderTypes={disabledOrderTypes} />
          {sm && (
            <HistoryLink
              target="_blank"
              rel="noopener noreferrer"
              aria-label="convert orders"
              href={getInnerUrl('/order/trade/convert')}
            >
              <ICHistoryOutlined size={sm ? 24 : 20} />
            </HistoryLink>
          )}
        </Header>
        <ConvertForm visible />
        {isLogin && <AgreeDialogRender />}
      </div>
    );
  },
);

export default withWrapper(Convert);
