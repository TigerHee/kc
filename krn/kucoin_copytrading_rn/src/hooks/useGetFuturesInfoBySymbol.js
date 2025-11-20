import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@krn/ui';

import {CONTRACT_TYPE} from 'constants/future';
import {formatCurrency} from 'utils/futures-helper';
import useLang from './useLang';

const CONTRACT_TYPE_I18_KEY = {
  [CONTRACT_TYPE.FFWCSX]: 'priceProtect.contract.perpetual', //_t('xx)
  [CONTRACT_TYPE.FFICSX]: 'priceProtect.contract.quarterly', // (交割合约)
};

export const useGetFuturesInfoBySymbol = symbol => {
  const {_t} = useLang();
  const {isRTL} = useTheme();
  const futuresSymbolsMap = useSelector(
    state => state.futures.futuresSymbolsMap,
  );

  const target = useMemo(
    () => futuresSymbolsMap?.[symbol] || {},
    [futuresSymbolsMap, symbol],
  );

  const showSymbolText = useMemo(() => {
    const {baseCurrency, displaySettleCurrency, type} = target || {};
    const showFormatCurrency = formatCurrency(baseCurrency);
    const typeText = CONTRACT_TYPE_I18_KEY[type]
      ? _t(CONTRACT_TYPE_I18_KEY[type])
      : '';
    if (isRTL) {
      // 合约类型 rtl下字符串拼接会镜像，此处 unicode 强制不镜像保证显示正确
      return `${showFormatCurrency} \u202E${typeText}\u202C/${displaySettleCurrency}`;
    }

    return `${showFormatCurrency} ${typeText}/${displaySettleCurrency}`;
  }, [_t, isRTL, target]);

  return {...target, showSymbolText};
};
