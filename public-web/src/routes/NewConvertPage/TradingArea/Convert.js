/*
 * owner: borden@kupotech.com
 */
import { Convert, pushTool } from '@kucoin-biz/convert';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import useRequest from 'src/hooks/useRequest';
import { useSelector } from 'src/hooks/useSelector';
import { getConvertBaseConfig } from 'src/services/convert';
import { tenantConfig } from 'src/config/tenant';
import {
  exposePageStateWithOutStoreForSSG,
  getPageStateByNameSpaceAndKeyFromSSG,
} from 'src/utils/ssgTools';
import { push } from 'utils/router/index';

pushTool.setPush(push);

const stateNamespace = 'convert_config';

const ConvertForm = React.memo(({ setSymbol, setIsLimitOrder, ...otherProps }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const rates = useSelector((state) => state.currency.rates);
  const prices = useSelector((state) => state.currency.prices);
  const currenciesMap = useSelector((state) => state.categories);
  const currency = useSelector((state) => state.currency.currency);
  const isHFAccountExist = useSelector((state) => state.user_assets.isHFAccountExist);
  const disabledOrderTypes = useMemo(() => {
    const rst = tenantConfig.convertPageConfig.disabledOrderTypes || [];
    return rst;
  }, []);

  const { data: res = getPageStateByNameSpaceAndKeyFromSSG(stateNamespace, 'res', { data: {} }) } =
    useRequest(getConvertBaseConfig, {
      onSuccess: (res) => {
        exposePageStateWithOutStoreForSSG({
          [stateNamespace]: { res },
        });
      },
    });
  const baseConvertConfig = res.data;

  const onSymbolChange = useCallback(
    (val) => {
      setSymbol(val);
    },
    [setSymbol],
  );

  const onTabChange = useCallback(
    (val) => {
      setIsLimitOrder(val === 'LIMIT');
    },
    [setIsLimitOrder],
  );

  const loginFn = useCallback(() => {
    dispatch({
      type: 'entranceDrawer/update',
      payload: {
        loginOpen: true,
      },
    });
  }, [dispatch]);

  const basicData = {
    user,
    rates,
    prices,
    loginFn,
    currency,
    onTabChange,
    currenciesMap,
    onSymbolChange,
    isHFAccountExist,
    baseConvertConfig,
  };

  return (
    <Convert
      // theme="dark"
      // defaultActiveTab={1}
      // defaultFromCurrency="USDT"
      // defaultToCurrency="BNB"
      basicData={basicData}
      disabledOrderTypes={disabledOrderTypes}
      {...otherProps}
    />
  );
});

export default ConvertForm;
