/**
 * Owner: ella.wang@kupotech.com
 */
import React from 'react';
import { _t, _tHTML, addLangToPath } from 'tools/i18n';
import siteCfg from 'utils/siteConfig';

const { KUCOIN_HOST } = siteCfg;

export const anchors = {
  question0: {
    id: 0,
    key: 'question0',
    title: _t('ihdsQusXQ33DDUyQ8nT9Fx'),
  },
  question1: {
    id: 1,
    key: 'question1',
    title: _t('cnW4nhKyTd6Q6HdCRDuox2'),
  },
  question2: {
    id: 2,
    key: 'question2',
    title: _t('tYBKonfv3BQXixEj9xKzFH'),
  },
  question3: {
    id: 3,
    key: 'question3',
    title: _t('soCLB258rc9tae2ZQgYhWY'),
  },
  Events: {
    id: 4,
    key: 'Events',
    title: _t('1jPdgN8rs4t47UVaZxYiCW'),
  },
  question4: {
    id: 5,
    key: 'question4',
    title: _t('2SZJfA2R9fYNz5s5Py3ggx'),
  },
  FAQ: {
    id: 6,
    key: 'FAQ',
    title: _t('5NvtXPAWC7xyRUZTAyBD5e'),
  },
};

export const getAnchorList = () => {
  const anchorlist = Object.entries(anchors).map(([key, val]) => val);
  anchorlist.sort((a, b) => {
    return a.id - b.id;
  });
  return anchorlist;
};

export const faqs = [
  {
    title: _t('4g5EmHbCvYjqUiXiZAE222'),
    description: [
      _tHTML('1vH3hxYejSUWBUuTf2S5y6', { url: addLangToPath(`${KUCOIN_HOST}/markets`) }),
    ],
  },
  {
    title: _t('tKkDgzAbwTPg2ZDo4dnfzm'),
    description: [
      _tHTML('i1AucEfAiNvwimBZiebYvq', {
        url: addLangToPath(`${KUCOIN_HOST}/learn/trading/crypto-portfolio-diversification`),
        marketurl: addLangToPath(
          `${KUCOIN_HOST}/learn/trading/mastering-risk-management-in-crypto-trading`,
        ),
      }),
    ],
  },
  {
    title: _t('8ZfEpD26jFwvCvJFnd73UU'),
    description: [
      _tHTML('7szLHxZjDBBdKQqiCL6RCN', {
        boturl: addLangToPath(`${KUCOIN_HOST}/trading-bot`),
        dcaurl: addLangToPath(`${KUCOIN_HOST}/learn/trading-bot/dca-trading-bot`),
        gridurl: addLangToPath(
          `${KUCOIN_HOST}/learn/trading-bot/how-to-make-passive-income-with-the-kucoin-spot-grid-trading-bot`,
        ),
      }),
    ],
  },
  {
    title: _t('pXN8zCjhbaYCq3cfwzs4AD'),
    description: [
      _tHTML('3M9WeGsXL9sFTQAds5PJsi', {
        url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/dyor`),
      }),
    ],
  },
  {
    title: _t('me6rYicbCHie3Xtn4HQNDV'),
    description: [
      _tHTML('p3f2cUmZ1CUs29HguTxRSX', {
        url: addLangToPath(
          `${KUCOIN_HOST}/learn/trading/mastering-risk-management-in-crypto-trading`,
        ),
        stopurl: addLangToPath(`${KUCOIN_HOST}/support/360015207073`),
      }),
    ],
  },
  {
    title: _t('ipiEr2zfaqPJKyVCjgMb5R'),
    description: [
      _tHTML('gqyL6A2Fgztv2SheF47L5i', {
        url: addLangToPath(`${KUCOIN_HOST}/learn`),
        boturl: addLangToPath(`${KUCOIN_HOST}/learn/crash-courses/trading-bot`),
      }),
    ],
  },
];

export const reasons = [
  {
    key: 'Ease',
    description: _tHTML('6ejrni7rYdGrTEeTDFSYyL'),
  },
  {
    key: 'Strategies',
    description: _tHTML('34vdpoNEZtYPDpmDTQYnos'),
  },
  {
    key: 'Risk',
    description: _tHTML('wWMMpfiHEDuDANkyQmzdRd'),
  },
  {
    key: 'Adaptability',
    description: _tHTML('j8NmBhiEfs2BNTVTrBEjHp'),
  },
  {
    key: 'Passive',
    description: _tHTML('i6HNu8qTXzdfsvD8mJhDm1', {
      url: addLangToPath(`${KUCOIN_HOST}/blog/how-to-make-passive-income-with-kucoin`),
    }),
  },
];

export const rightCrypto = [
  {
    key: 'Platform',
    description: _tHTML('eGBpLtZDnzKr8Q9AwGabTG'),
  },
  {
    key: 'Liquidity',
    description: _tHTML('ezfMTJh5atRe4DxV8aHCCB'),
  },
  {
    key: 'Fees',
    description: _tHTML('xtztf6CbPzjipbDp3szitD', {
      url: addLangToPath(`${KUCOIN_HOST}/blog/kucoin-fees-a-full-breakdown-before-trading-crypto`),
    }),
  },
  {
    key: 'Security',
    description: _tHTML('2JVyocUmZoHWVshUwLquss', {
      url: addLangToPath(`${KUCOIN_HOST}/proof-of-reserves`),
      weburl: addLangToPath(`${KUCOIN_HOST}/learn/crypto/what-is-a-crypto-wallet`),
    }),
  },
  {
    key: 'Friendliness',
    description: _tHTML('tvL9bNz2jArsoN6GNVATN6'),
  },
  {
    key: 'Compliance',
    description: _tHTML('rSnmc8TsARToaYuCN4yNDh'),
  },
  {
    key: 'Tools',
    description: _tHTML('rfhMhqm7wbTaKwz7WRTpxM', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/trading/crypto-portfolio-diversification`),
      riskurl: addLangToPath(
        `${KUCOIN_HOST}/learn/trading/mastering-risk-management-in-crypto-trading`,
      ),
    }),
  },
];

export const risks = [
  {
    key: 'Market Risk',
    title: _t('wbXLncitzX9hAcyuh3vo8T'),
    description: (
      <React.Fragment>
        {_tHTML('prxjHPGphvoSWB1ECo7XcB', { url: addLangToPath(`${KUCOIN_HOST}/price/BTC`) })}
      </React.Fragment>
    ),
  },
  {
    key: 'Liquidity Risk',
    title: _t('aFLiKDVE4ShRdLN34d9YUy'),
    description: <React.Fragment>{_t('bLkxqRaowWd4Up7HzmHJVw')}</React.Fragment>,
  },
  {
    key: ' Reliance on Others Expertise',
    title: _t('wDDNxzPdquD5vy2hNz7bnF'),
    description: <React.Fragment>{_t('9vJtKFry8Q1xpq2TjbPG4x')}</React.Fragment>,
  },
  {
    key: 'Systematic Risk',
    title: _t('oTvmMaufkit23fYu1hp5pP'),
    description: <React.Fragment>{_t('94HZ4AG61AYiY8N7PidjXH')}</React.Fragment>,
  },
];

export const tricks = [
  {
    key: 'Traders',
    description: _tHTML('kxrkPiCHRtmVg6HRPZsmmA'),
  },
  {
    key: 'Portfolio',
    description: _tHTML('cRN8dqRBPPQTsRsXAxHVCy'),
  },
  {
    key: 'Assets',
    description: _tHTML('83CAS4YD4VajA7MynM4pvs'),
  },
  {
    key: 'Regularly',
    description: _tHTML('3m3aExxCT4dtxmb52KbfEa'),
  },
  {
    key: 'Practice',
    description: _tHTML('fQjMAkUAQSfPs29m44gwYz'),
  },
];
