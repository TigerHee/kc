/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Spin } from '@kux/mui';
import { debounce, replace } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { trackClick } from 'src/utils/ga';
import wariningSvg from 'static/margin/icon-warning.svg';
import autoLend from 'static/margin/Icon_interface_autolend.svg';
import { _t, _tHTML } from 'tools/i18n';
import {
  ACCOUNT_CODE,
  ACCOUNT_MAP,
  AUTO_LEND_STATUS,
  checkIsMarginAccount,
  STATUS,
} from './config';
import { Description, Flex, FlexBetween, Root, Title } from './styles/tips/style';

const TransferTips = (props) => {
  const {
    to,
    from,
    loading,
    dispatch,
    currency,
    currencies, // 批量
    batchLendCoins,
    isLiability,
    isAutoRepay,
    postLoading,
    isAutoLend,
    currencyName,
    toSymbolName,
    isToMarginAccount,
  } = props;
  const fromAccountType = replace(from[0], /SUB_/, '');
  const toAccountType = replace(to[0], /SUB_/, '');
  const isToMainAccount = toAccountType === ACCOUNT_CODE.MAIN;
  // 是否在弹框中手动关闭了自动续借
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    setIsClosed(false);
  }, [currency, isToMainAccount]);

  useEffect(() => {
    // 获取批量自动借出配置
    fetchBatchLendConfig(isToMainAccount, currencies);
  }, [isToMainAccount, currencies]);

  const fetchBatchLendConfig = debounce((isToMainAccount, currencies) => {
    // 获取批量自动借出配置
    if (isToMainAccount && currencies) {
      dispatch({
        type: 'transfer/pullBatchLendConfg',
        payload: {
          currencies: currencies,
        },
      });
    } else {
      dispatch({
        type: 'transfer/update',
        payload: {
          batchLendConfigMap: {},
        },
      });
    }
  }, 300);

  const closeAutoLending = useCallback(() => {
    dispatch({
      type: 'marginMeta/postAutoLend',
      payload: {
        currency,
        autoLendStatus: AUTO_LEND_STATUS.DISABLE,
      },
    }).then((success) => {
      if (success) {
        setIsClosed(true);
        dispatch({
          type: 'marginMeta/updateAutoLendConfig',
          payload: {
            currency,
            isAutoLend: false,
          },
        });
      }
    });
    trackClick(['TransferWindow', '5']);
  }, [currency]);

  const closeAutoRepay = useCallback(() => {
    if (!isToMarginAccount) return;
    const updateAutoRepayEffect =
      toAccountType === ACCOUNT_CODE.MARGIN
        ? 'marginMeta/postAutoRepayConfig'
        : 'isolated/updateAutoRepay';
    dispatch({
      type: updateAutoRepayEffect,
      payload: {
        symbol: to[1],
        switchStatus: false,
      },
    });
    trackClick(['TransferWindow', '6']);
  }, [to]);

  // 从储蓄划转到合约
  if (fromAccountType === ACCOUNT_CODE.MAIN && toAccountType === ACCOUNT_CODE.CONTRACT) {
    return <Description>{_t('kumex.transfer.warn')}</Description>;
  }
  if (isToMarginAccount) {
    // 穿仓
    if (isLiability) {
      return (
        <Root>
          <Flex>
            <img alt="warning-img" width={24} height={24} src={wariningSvg} />
            <Title>{_tHTML('marginAccount.liability.label')}</Title>
          </Flex>
          <Description style={{ marginTop: 2 }}>
            {ACCOUNT_MAP[toAccountType].negativeBalanceTip({
              symbol: replace(toSymbolName, '-', '/'),
            })}
          </Description>
        </Root>
      );
    }
    // 自动还币
    if (isAutoRepay) {
      return (
        <Root>
          <FlexBetween>
            <span>{_t('transfer.autoRepay.enabled')}</span>
            {/* <div className={styles.flex}>
              <span style={{ marginRight: 8 }}>{_t('transfer.autoRepay')}</span>
              <Spin size="xsmall" spinning={!!postLoading} style={{ display: 'inline-block' }}>
                <Switch checked={isAutoRepay} onClick={closeAutoRepay} />
              </Spin>
            </div> */}
          </FlexBetween>
          <Description style={{ marginTop: 2 }}>
            {ACCOUNT_MAP[toAccountType].autoRepayEnabledTip({
              symbol: replace(toSymbolName, '-', '/'),
            })}
          </Description>
        </Root>
      );
    }
  }
  // 批量 自动出借
  if (isToMainAccount && (isClosed || isAutoLend)) {
    return (
      <Spin spinning={!!loading}>
        <Root>
          <Flex>
            <img alt="auto-lend-img" width={24} height={24} src={autoLend} />
            <Title>
              {!isAutoLend
                ? _tHTML('margin.auto.already.close', { coin: currencyName })
                : _tHTML('margin.auto.lend.opened', { coin: currencyName })}
            </Title>
            {/* <a
              style={{ marginLeft: 4 }}
              onClick={isClosed ? noop : closeAutoLending}
              {...(isClosed ? { href: '/margin/lend' } : {})}
            >
              {isClosed ? _t('view.more') : _t('margin.close.immediately')}
            </a> */}
          </Flex>
          {isAutoLend && (
            <Description style={{ marginTop: 2 }}>
              {_t('autoLend.tip', {
                account: ACCOUNT_MAP[toAccountType].label(),
                coins: currency || batchLendCoins?.join(),
              })}
            </Description>
          )}
        </Root>
      </Spin>
    );
  }

  return null;
};

export default injectLocale(
  connect((state, { to, currency, currencies }) => {
    const { tagMap } = state.isolated;
    const { categories } = state;
    const { isolatedSymbolsMap } = state.market;
    const { autoLendConfig, userPosition, positionDetail } = state.marginMeta;
    const { batchLendConfigMap } = state.transfer;

    const { currencyName = '' } = categories[currency] || {};
    const toSymbol = to[1];
    const toAccount = replace(to[0], /SUB_/, '');
    const isToMarginAccount = checkIsMarginAccount(toAccount);
    const { symbolName: toSymbolName = '' } = isolatedSymbolsMap[toSymbol] || {};

    const marginIsAutoRepay = !!userPosition?.isAutoRepay;
    const isolatedIsAutoRepay = tagMap[toSymbol] ? tagMap[toSymbol].isAutoRepay : false;
    const isAutoRepay = toSymbol ? isolatedIsAutoRepay : marginIsAutoRepay;

    const batchLendCoins = Object.keys(batchLendConfigMap);

    const isAutoLend = currencies ? batchLendCoins.length > 0 : !!autoLendConfig[currency];

    const { status } = tagMap[toSymbol] || userPosition || {};
    const LIABILITY_CODE = STATUS[toAccount]?.LIABILITY?.code;
    const isLiability = !!status && status === LIABILITY_CODE;
    return {
      status,
      isLiability,
      isAutoRepay,
      isAutoLend,
      toSymbolName,
      currencyName,
      isToMarginAccount,
      batchLendCoins,
      loading:
        state.loading.effects['marginMeta/postAutoLend'] ||
        state.loading.effects['marginMeta/pullAutoLendConf'],
      postLoading: state.loading.effects['marginMeta/postAutoRepayConfig'],
    };
  })(TransferTips),
);
