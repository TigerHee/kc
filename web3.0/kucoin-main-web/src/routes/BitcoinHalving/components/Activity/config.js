/**
 * Owner: ella@kupotech.com
 */
import siteConfig from 'utils/siteConfig';
import futures from 'static/bitcoin-halving/futures.png';
import earn from 'static/bitcoin-halving/earn.png';
const { KUCOIN_HOST } = siteConfig;

export const ActivityConfig = [
  {
    url: `${KUCOIN_HOST}/land/activity/BTC-Halving-Countdown-campaign`,
    img: futures,
    title: 'Future trading competition',
    startTime: '2024-3-26 12:00:00',
    endTime: '2024-4-16 12:00:00',
    key: 'futures',
    blockid: 'future',
  },
  {
    url: `${KUCOIN_HOST}/land/promotions/earn_btc_halving_event`,
    img: earn,
    title: 'KuCoin earn-Bitcoin Halving',
    startTime: '2024-3-28 09:00:00',
    endTime: '2024-4-18 09:00:00',
    key: 'earn',
    blockid: 'earn',
  },
];
