/**
 * Owner: will.wang@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { sharePoster, loadImageAsBase64WithCache, setup } from '@kc/mk-design';
import { getTenantConfig } from '@/config/tenant';
import JsBridge from "gbiz-next/bridge";
import { useCategoriesStore } from '@/store/categories';
import { useCoinDetailStore } from '@/store/coinDetail';
import useTranslation from '@/hooks/useTranslation';
import { useRouter } from 'kc-next/compat/router';
import useTransPrice from '@/hooks/useTransPrice';
import Content from '@/routes/[coin]/components/FloatComponents/Share/Content';
import { querySharePosterConfig } from '@/services/reward';

import '@kc/mk-design/dist/style.css';

//  初始化mk
setup({
  jsBridge: JsBridge
});


export default function useSharePoster() {
const showShare = getTenantConfig().showAppShare;
  const router = useRouter();
  const coin = router?.query.coin as string;
  const { _t } = useTranslation();

  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coin ? coinDict[coin as string] : null;
  const latestPrice = useCoinDetailStore((state) => state.latestPrice);
  const bestSymbol = useCoinDetailStore((state) => state.bestSymbol);
  const tradeData = useCoinDetailStore((state) => bestSymbol ? state.tradeData[bestSymbol] || null : null);

  const currentRenderPrice = useTransPrice({
    price: String(latestPrice),
    symbol: bestSymbol,
    isUnsaleATemporary: false,
    needTransfer: true,
    needHandlePrice: true,
    hideChar: false,
  })

  const currentChangeRate = useMemo(() => {
    return tradeData?.priceChangeRate24h ? +tradeData?.priceChangeRate24h : null;
  }, [tradeData]);


  const handleOpenShare = useCallback(async () => {
    if (!showShare || typeof window === 'undefined') {
      return
    }

    try {
      // 先把背景图转成base64
      const posterBg = `https://assets.staticimg.com/cms/media/4IoGkF4GWHcHMlTBVSUKN1A1ZSPAtRBybOIBxYZh2.png?t=${Date.now()}`;
      const [posterToBase64, logoToBase64] = await Promise.all([loadImageAsBase64WithCache(posterBg), loadImageAsBase64WithCache('/logo.png')]);


      const shareTitle = _t('inviteB.manage.poster.share');

      const config = await querySharePosterConfig();
      const posterText = (config?.data?.properties || []).find(i => i.property === 'SharePosterTxt')?.value;


      // 调用share方法
      await sharePoster({
        cacheId: 'price-share',
        errorText: 'error',
        dlgTitle: shareTitle,
        copyBtnText: 'copy',
        saveBtnText: 'save',
        copySuccessText: 'copied',
        link: window.location.href,
        poster: {
          children: (
            <Content
              coin={coin}
              coinObj={coinObj}
              latestPrice={latestPrice}
              bestSymbol={bestSymbol}
              currentChangeRate={currentChangeRate}
              changeRateLabel={_t('coin.detail.line.type.24H')}
              renderedPrice={currentRenderPrice}
            />
          ),
          size: { width: 265, height: 453 },
          background: posterToBase64,
          footer: {
            title: posterText || '',
            logo: logoToBase64,
          }
        }
      });
    } catch (error) {
      console.log('useSharePoster error', error);
    }

  }, [_t, bestSymbol, coin, coinObj, currentChangeRate, currentRenderPrice, latestPrice, showShare]);

  return handleOpenShare;
}