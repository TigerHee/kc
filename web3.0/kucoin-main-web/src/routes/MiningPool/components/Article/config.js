/**
 * Owner: ella@kupotech.com
 */
import { _t, _tHTML, addLangToPath } from 'tools/i18n';
import siteCfg from 'utils/siteConfig';
import readlg1 from 'static/mining-pool/readlg1.svg';
import readsm1 from 'static/mining-pool/readsm1.svg';
import readlg2 from 'static/mining-pool/readlg2.svg';
import readsm2 from 'static/mining-pool/readsm2.svg';
import readlg3 from 'static/mining-pool/readlg3.svg';
import readsm3 from 'static/mining-pool/readsm3.svg';
import readlg4 from 'static/mining-pool/readlg4.svg';
import readsm4 from 'static/mining-pool/readsm4.svg';
import readlg5 from 'static/mining-pool/readlg5.svg';
import readsm5 from 'static/mining-pool/readsm5.svg';
import readlg6 from 'static/mining-pool/readlg6.svg';
import readsm6 from 'static/mining-pool/readsm6.svg';
import readlg7 from 'static/mining-pool/readlg7.svg';
import readsm7 from 'static/mining-pool/readsm7.svg';

const { KUCOIN_HOST } = siteCfg;

export const tabulations = [
  {
    key: 'Resource Pooling',
    title: _t('6u4aTb7mpEWMaNgtPrERhX'),
    description: _tHTML('d7gGi18dySj2UAC9xsKvof', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/hashrate`),
    }),
  },
  {
    key: 'Block Reward Distribution',
    title: _t('fKfoegsqTyeALZAXupFD3u'),
    description: _t('5nr53UrSm7NJ8YLigrUM9G'),
  },
  {
    key: 'Reduced Variance',
    title: _t('b4ob9tuEtemP4kB3i4AP4s'),
    description: _t('msVAfgomF3A1HLhnaRpi45'),
  },
];

export const types = [
  {
    key: 'Pay-Per-Share (PPS)',
    title: _t('uFtoZzjxK18TqRn1WKkid3'),
    description: _t('rBkHFsBmHa41yUNjF8frRj'),
  },
  {
    key: 'Proportional (PROP)',
    title: _t('4pmCg1u3EzsbSpSdvmzHdX'),
    description: _t('tYemzhMerTE41r31m7wPWX'),
  },
  {
    key: 'Pay-Per-Last-N-Shares (PPLNS)',
    title: _t('5ocEbUo4p6sYeagZb95wUU'),
    description: _t('nD1cvN6B8pJ2ii8ckM1oVW'),
  },
  {
    key: 'Score-Based',
    title: _t('rsvkERrEySYCBNWTaUXnbg'),
    description: _t('tm2TJwdEPwfP7X6EK7onVt'),
  },
  {
    key: 'Peer-to-Peer (P2P) Mining Pools',
    title: _t('g5pT5ctvyK2Vq4YjEwq7p3'),
    description: _t('viovR41Lx55WrLV7hc3nxH'),
  },
  {
    key: 'Hybrid Mining Pools',
    title: _t('2QUThXEHUMZQH1rW96ywqH'),
    description: _t('jWHWuYBNQPjRTK5jYR4T6Z'),
  },
];

export const chooseBests = [
  {
    key: 'Cryptocurrency',
    description: _tHTML('c147f9Dmj8CzjL1qJy6Pd5', {
      btcurl: addLangToPath(`${KUCOIN_HOST}/price/BTC`),
      url: addLangToPath(`${KUCOIN_HOST}/price/LTC`),
    }),
  },
  {
    key: 'Latency',
    description: _tHTML('9hK2i7qu9ucJ4grAZRAByv'),
  },
  {
    key: 'Payouts',
    description: _tHTML('6i1mMgas876iLmK6x3Znmq'),
  },
  {
    key: 'Size',
    description: _tHTML('vh2A43gNaYfTspWVoF3vPe'),
  },
  {
    key: 'Measures',
    description: _tHTML('wy9f8tW1qX1FZSV1ZGZBtJ', {
      url: addLangToPath(`${KUCOIN_HOST}/support/360014897913`),
    }),
  },
];

export const joinPools = [
  {
    key: 'Account',
    description: _tHTML('waNghH39eUSWrYXvQmBiKG'),
  },
  {
    key: 'Email',
    description: _tHTML('tiaqmNw3AmEkAsBhiNZPQk'),
  },
  {
    key: 'Address',
    description: _tHTML('e9PmV2TRpwvanMnUWvBdP2'),
  },
  {
    key: 'Device',
    description: _tHTML('x1tWcBg9roWWDnznGK2Ztv'),
  },
  {
    key: 'Start',
    description: _tHTML('vp8mjAkqs33woDifDZpoZC'),
  },
];

export const faqs = [
  {
    title: _t('tzx8VCh238UfBTe13jTnZ7'),
    description: [
      _tHTML('stNHYgU8hbJMzLgsrA8twA', {
        url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/crypto-mining-difficulty-explained`),
      }),
    ],
  },
  {
    title: _t('ouNyDNtr4SYGHr3EkcqHkU'),
    description: [_t('rGBymmDGL3o2fBoSA3HLSK')],
  },
  {
    title: _t('mdwTuwdsHwyHrfdbpzWaCm'),
    description: [_t('xnoYaWNnok2csJbustEqWq')],
  },
  {
    title: _t('6rAZBPhTN1vNgVMXtHe34M'),
    description: [
      _t('1FYCy9VpWKrfkWayd2TvHL'),
      _t('ePUBvxK9udnMJNg6hoSLnL'),
      _t('mazneffDuLuw7AoCJeMsEd'),
    ],
  },
  {
    title: _t('wVCdi22mJoE4Brf7xLzRzN'),
    description: [_t('9Vg9Ye1NshSRtk2XPYyH3c')],
  },
];

export const readings = [
  {
    id: 1,
    title: _t('sBYQvsoXA5GfLWS6oy3EDy'),
    description: _t('fJDifFBStUaxqY55wqPDTy'),
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/cloud-mining-everything-you-should-know`),
    lgIcon: readlg1,
    smIcon: readsm1,
    blokid: 'miningpoolmodule4a',
  },
  {
    id: 2,
    title: _t('tfhmwn69kz2FEg4E1683iC'),
    description: _t('f5Zge54Cj2Ntd1RrAMMfCG'),
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/all-about-crypto-mining-how-to-start`),
    lgIcon: readlg2,
    smIcon: readsm2,
    blokid: 'miningpoolmodule4b',
  },
  {
    id: 3,
    title: _t('nEEtJtTfbbbwwHNrL6gKgD'),
    description: _t('bQcvmNzMXKk2oiNh6dTK3u'),
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/crypto-mining-difficulty-explained`),
    lgIcon: readlg3,
    smIcon: readsm3,
    blokid: 'miningpoolmodule4c',
  },
  {
    id: 4,
    title: _t('wPU4X3y44gk7M5kPDCRbGh'),
    description: _t('aa5gwYmaJCTShpcjvDY3vA'),
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/the-best-cryptos-to-mine`),
    lgIcon: readlg4,
    smIcon: readsm4,
    blokid: 'miningpoolmodule4d',
  },
  {
    id: 5,
    title: _t('9pxXSB9QSmkqF7CiYXsWLH'),
    description: _t('hntWMBAJXos4t7XTAdmsne'),
    url: addLangToPath(
      `${KUCOIN_HOST}/learn/crypto/how-to-mine-litecoins-the-ultimate-guide-to-litecoin-mining`,
    ),
    lgIcon: readlg5,
    smIcon: readsm5,
    blokid: 'miningpoolmodule4e',
  },
  {
    id: 6,
    title: _t('gwsYjMW6jHoAFS9oDGU5r9'),
    description: _t('cLfojvQLgkQL2PDKBRAkwa'),
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/bitcoin-halving-countdown`),
    lgIcon: readlg6,
    smIcon: readsm6,
    blokid: 'miningpoolmodule4f',
  },
  {
    id: 7,
    title: _t('sQMg3Fi5tpV2gL7nDfVM9w'),
    description: _t('2rD9WGCFmGWXkE4QBAxRZF'),
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/litecoin-halving-countdown`),
    lgIcon: readlg7,
    smIcon: readsm7,
    blokid: 'miningpoolmodule4g',
  },
];
