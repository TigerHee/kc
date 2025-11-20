/*
 * owner: borden@kupotech.com
 * desc: 划转弹窗
 */
import { intersection } from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from '@tools/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Transfer, TransferEvent } from '@packages/transfer';
import useContextSelector from '../hooks/common/useContextSelector';
import { NAMESPACE, ACCOUNT_TYPE_LIST_MAP, ORDER_TYPE_MAP } from '../config';
import getStore from '../utils/getStore';
import { useFromCurrency } from '../hooks/form/useStoreValue';
import { fromCurrencySelector, toCurrencySelector } from '../models';

const TransferModal = ({ transferConfig, ...otherProps }) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const user = useContextSelector((state) => state.user);
  const theme = useContextSelector((state) => state.theme);
  const prices = useContextSelector((state) => state.prices);
  const currenciesMap = useContextSelector((state) => state.currenciesMap);
  const isHFAccountExist = useContextSelector((state) => state.isHFAccountExist);
  const isolatedSymbolsMap = useContextSelector((state) => state.isolatedSymbolsMap);
  const curAccountType = useSelector((state) => state[NAMESPACE].accountType);
  const curFromCurrency = useFromCurrency();

  const { language } = i18n || {}; // 当前语言
  const { initDict } = ACCOUNT_TYPE_LIST_MAP[curAccountType] || {};

  useEffect(() => {
    const onTransferEvent = async ({ from, to, currencies }) => {
      const [toAccountType] = to;
      const [fromAccountType] = from;
      const store = await getStore();
      const { orderType, accountType } = store[NAMESPACE] || {};
      const fromCurrency = fromCurrencySelector(store[NAMESPACE] || {});
      const toCurrency = toCurrencySelector(store[NAMESPACE] || {});
      const { accountTypes } = ACCOUNT_TYPE_LIST_MAP[accountType] || {};
      const _currencies = intersection([fromCurrency, toCurrency], currencies);
      const _accountTypes = intersection([fromAccountType, toAccountType], accountTypes);
      const pullPositionEffectName = ORDER_TYPE_MAP[orderType]?.pullPositionEffectName;
      if (_currencies.length && _accountTypes.length === 1 && pullPositionEffectName) {
        dispatch({
          type: `${NAMESPACE}/${pullPositionEffectName}`,
          payload: {
            currencies: _currencies,
            accountTypes: _accountTypes,
          },
        });
      }
    };
    TransferEvent.on('transfer.success', onTransferEvent);
    return () => {
      TransferEvent.off('transfer.success', onTransferEvent);
    };
  }, [dispatch]);

  if (!user) return null;
  return (
    <Transfer
      theme={theme}
      userInfo={user}
      prices={prices}
      currentLang={language}
      categories={currenciesMap}
      isHFAccountExist={isHFAccountExist}
      isolatedSymbolsMap={isolatedSymbolsMap}
      transferConfig={{
        initCurrency: curFromCurrency,
        ...(initDict ? { initDict } : null),
        ...transferConfig,
      }}
      {...otherProps}
    />
  );
};

export default React.memo(TransferModal);
