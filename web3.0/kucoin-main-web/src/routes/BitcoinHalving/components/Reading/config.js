/**
 * Owner: ella@kupotech.com
 */
import { _t } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
const { KUCOIN_HOST } = siteConfig;

export const difficultyMap = {
  1: {
    content: _t('5UAagNJanXYhYP958MbQ9o'),
    color: '#2DBD96',
    background: 'rgba(45, 189, 150, 0.08)',
  },
  2: {
    content: _t('vJn3yjZEhZQc5byNLcCPtX'),
    color: '#FBA629',
    background: 'rgba(255, 181, 71, 0.08)',
  },
  3: {
    content: _t('87i7EUmx9rXU9bzvGbGCt2'),
    color: '#ED6666',
    background: 'rgba(237, 102, 102, 0.08)',
  },
};

export const readingList = [
  {
    url: `${KUCOIN_HOST}/learn/crypto/how-to-mine-bitcoin`,
    title: 'how-to-mine-bitcoin',
    type: 'learn',
  },
  {
    url: `${KUCOIN_HOST}/learn/crypto/what-is-a-bitcoin-etf`,
    title: 'what-is-a-bitcoin-etf',
    type: 'learn',
  },
  {
    url: `${KUCOIN_HOST}/learn/crypto/top-bitcoin-layer-2-projects`,
    title: 'top-bitcoin-layer-2-projects',
    type: 'learn',
  },
  {
    url: `${KUCOIN_HOST}/learn/crypto/cloud-mining-everything-you-should-know`,
    title: 'cloud-mining-everything-you-should-know',
    type: 'learn',
  },
  {
    url: `${KUCOIN_HOST}/blog/is-bitcoin-a-strong-hedge-against-inflation`,
    title: 'is-bitcoin-a-strong-hedge-against-inflation',
    type: 'blog',
  },
  {
    url: `${KUCOIN_HOST}/learn/crypto/top-bitcoin-etfs-where-and-how-to-buy`,
    title: 'top-bitcoin-etfs-where-and-how-to-buy',
    type: 'learn',
  },
];
