import { bootConfig } from "kc-next/boot";


export const getRenderPrice = (options: {
  latestPrice: string | number | null;
  thLatestPrice?: string | number | null;
  tradeDataPrice?: string | number | null;
  candleClosePrice: string | number | null;
}) => {
  const { latestPrice, thLatestPrice, tradeDataPrice, candleClosePrice } = options;
  const IS_TH_SITE = bootConfig._BRAND_SITE_ === 'TH';

  if (IS_TH_SITE) {
    if (latestPrice) {
      return {
        price: latestPrice,
        needRateConversion: false,
      }
    }
    return {
      price: thLatestPrice || tradeDataPrice,
      needRateConversion: true,
    };
  }
  return {
    price: latestPrice || tradeDataPrice || candleClosePrice,
    needRateConversion: true,
  };
}