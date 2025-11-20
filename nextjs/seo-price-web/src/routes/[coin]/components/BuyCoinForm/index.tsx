/**
 * Owner: kevyn.yu@kupotech.com
 */
import { Spin, Tab, Tabs } from '@kux/mui-next';
import React, { useEffect, useMemo } from 'react';
import useScreen from 'src/hooks/useScreen';
// import { useSelector } from 'src/hooks/useSelector';
// import { IS_TR_SITE } from 'src/utils/env';
// import { trackClick } from 'src/utils/ga';
import BuyTab from './components/BuyTab';
import TradeTab from './components/TradeTab';
import styles from './style.module.scss';
import { useRouter } from 'kc-next/compat/router';
import { useCoinDetailStore } from '@/store/coinDetail';
import { trackClick } from 'gbiz-next/sensors';
import useTranslation from '@/hooks/useTranslation';
import clsx from 'clsx';
import { useCurrencyStore } from '@/store/currency';
import { bootConfig } from 'kc-next/boot';
import { getTenantConfig } from '@/config/tenant';




const BuyCoinForm = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const coin = router?.query.coin;

  const { isSm } = useScreen();
  const expressSymbol = useCoinDetailStore((state) => state.expressSymbol);
  const [selectTab, setSelectTab] = React.useState(0);


  const currency = useCurrencyStore((state) => state.currency);

  const isUnsale = useCoinDetailStore((state) => state.coinInfo.isUnsale);
  const tradingPairs = useCoinDetailStore((state) => state.tradingPairs);

  // const loading = useSelector((state) => {
  //   return state.loading.effects['coinDetail/getExpressSymbolByCoin'];
  // });

  const handleClick = (key) => {
    trackClick([key === 0 ? 'TradeButton' : 'BuyButton', '1'], { symbol: coin });
    if (expressSymbol) {
      setSelectTab(key);
    }
  };

  // 拉取 express 交易对 TODO ssr渲染路由不会push，修改待定
  useEffect(() => {
    if (coin && currency) {
      // dispatch({ type: 'coinDetail/getExpressSymbolByCoin', payload: { coin, currency } });
    }
  }, [coin]);

  // 是否展示buy，土耳其站不展示
  const showBuyCoinTab = useMemo(() => {
    if (!getTenantConfig().showDetailBuycoinForm) {
      return false;
    }

    return !!expressSymbol;
  }, [expressSymbol]);

  // if (isUnsale || (!tradingPairs.length && !expressSymbol)) {
  //   return null;
  // }

  return (
    <section className={styles.wrapper} data-inspector="inspector_kcs_buyform">
      <Tabs
        value={selectTab}
        bordered={false}
        className={'buyCoinTabs'}
        size={isSm ? 'xsmall' : 'large'}
      >
        <Tab
          label={
            <span className={clsx(styles.tabLabel, {
              [styles.active]: selectTab === 0
            })}  onClick={() => handleClick(0)}>
              {t('57TsvnskfMw8iRLL1Asf55')}
            </span>
          }
        />
        {showBuyCoinTab && (
          <Tab
            label={
              <span className={clsx(styles.tabLabel, {
                [styles.active]: selectTab === 1
              })} onClick={() => handleClick(1)}>
                {t('c835b58f230e4000aad8')}
              </span>
            }
          />
        )}
      </Tabs>
      <Spin type="normal" spinning={false}>
        <BuyTab visible={selectTab === 1} />
        <TradeTab visible={selectTab === 0} />
      </Spin>
    </section>
  );
};

export default BuyCoinForm;