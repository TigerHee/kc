/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import useSensorFunc from '@/hooks/useSensorFunc';
import { useTheme } from '@kux/mui';
import { _t } from 'utils/lang';
import hooks from '@kucoin-biz/hooks';
import { TransferModal } from '@kucoin-biz/transfer';

/**
 * 资金划转
 */
const TransferModalWrapper = React.memo(() => {
  const { currentTheme } = useTheme();
  const userInfo = useSelector((state) => state.user.user);
  const isolatedSymbolsMap = useSelector(
    (state) => state.symbols.isolatedSymbolsMap,
  );
  const sensorFunc = useSensorFunc();
  const dispatch = useDispatch();
  const _isHFAccountExist = useSelector(
    (state) => state.user_assets.isHFAccountExist,
  );
  const isHFAccountExist = hooks?.useShowHfAccount?.(_isHFAccountExist) || false;
  const categories = useSelector((state) => state.categories);
  const currentLang = useSelector((state) => state.app.currentLang);
  const prices = useSelector((state) => state.currency.prices);
  const transferConfig = useSelector((state) => state.transfer.transferConfig);
  const { visible } = transferConfig;

  useEffect(() => {
    if (visible) {
      sensorFunc(['transferWindow', 'confirmBtn', 'expose']);
    }
  }, [visible, sensorFunc]);

  return (
    <TransferModal
      theme={currentTheme}
      isHFAccountExist={isHFAccountExist}
      categories={categories}
      userInfo={userInfo}
      visible={visible}
      transferConfig={{
        ...transferConfig,
      }}
      isolatedSymbolsMap={isolatedSymbolsMap}
      currentLang={currentLang}
      prices={prices}
      onClose={() => {
        dispatch({
          type: `transfer/updateTransferConfig`,
          payload: {
            visible: false,
            callback: null,
          },
        });
      }}
      reOpen={() => {
        dispatch({
          type: `transfer/updateTransferConfig`,
          payload: {
            visible: true,
          },
        });
      }}
    />
  );
});

export default TransferModalWrapper;
