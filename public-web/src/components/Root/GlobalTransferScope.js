/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import loadable from '@loadable/component';
import { memo, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';

const TransferModal = loadable(() => System.import('@kucoin-biz/transfer'), {
  resolveComponent: (module) => {
    return module.TransferModal;
  },
});

const GlobalTransferScope = () => {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user, shallowEqual);
  const categories = useSelector((state) => state.categories, shallowEqual);
  const visible = useSelector((state) => state.transfer.visible);
  const initCurrency = useSelector((state) => state.transfer.initCurrency);
  const cusOnClose = useSelector((state) => state.transfer.cusOnClose);
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  useEffect(() => {
    if (user) {
      // 资产
      dispatch({
        type: 'user_assets/pullAccountCoins@polling',
      });
      return () => {
        dispatch({
          type: 'user_assets/pullAccountCoins@polling:cancel',
        });
      };
    }
  }, [dispatch, user]);

  return (
    <>
      {!!user ? (
        <TransferModal
          categories={categories}
          userInfo={user}
          theme={currentTheme}
          visible={visible}
          transferConfig={{
            initCurrency: initCurrency || '',
          }}
          currentLang={currentLang}
          onClose={() => {
            dispatch({
              type: `transfer/update`,
              payload: {
                visible: false,
              },
            });
            cusOnClose?.();
          }}
          reOpen={() => {
            dispatch({
              type: `transfer/update`,
              payload: {
                visible: true,
              },
            });
          }}
        />
      ) : null}
    </>
  );
};

export default memo(GlobalTransferScope);
