/**
 * Owner: ella.wang@kupotech.com
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

const { KUCOIN_HOST } = siteCfg;

export const anchors = {
  question0: {
    id: 0,
    key: 'question0',
    title: _t('vxSyNmLiTLQqQUayEjR7yz'),
  },
  question1: {
    id: 1,
    key: 'question1',
    title: _t('enDMwiov8KR94HmF2kPFkz'),
  },
  question2: {
    id: 2,
    key: 'question2',
    title: _t('kzvgdbX71LRzLbmgcVsTXc'),
  },
  question3: {
    id: 3,
    key: 'question3',
    title: _t('i3eb9ECdxM9Anx1nNh8Hdq'),
  },
  Events: {
    id: 4,
    key: 'Events',
    title: _t('jZBG3DCt9AbwbHGM7TectD'),
  },
  question4: {
    id: 5,
    key: 'question4',
    title: _t('bQ4uR2zuHgztycrj5JZjAu'),
  },
  reading: {
    id: 6,
    key: 'reading',
    title: _t('aNrYQDGvVJuSAUQgyKy5eQ'),
  },
  FAQ: {
    id: 7,
    key: 'FAQ',
    title: _t('cpvnsLg84pabj53igjUKr4'),
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
    title: _t('rYyuZTx3o9616qQ2tTsnka'),
    description: [_t('tCH5QWn7vJ3SzvLWwbQy5r')],
  },
  {
    title: _t('79wdRLXjSri58AfZiyZVyY'),
    description: [
      _tHTML('bjNprcAaFGby9TmeSU3Wa1', {
        url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/erc-20`),
      }),
    ],
  },
  {
    title: _t('39YsXrDzEMJJ1aeqjPh5BC'),
    description: [_t('hbh1szDFLEuNSkSqYL8r9x')],
  },
  {
    title: _t('3F8wshBkvggeq6kvmAfBwk'),
    description: [_t('2V2zoWuCSGJWyZsZ8xWv7u')],
  },
  {
    title: _t('bS1qMG8qhDQF2Jzh3JSaMd'),
    description: [
      _tHTML('vUuTDgDXepsao3FvMq8UMM', {
        url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/opensea`),
      }),
    ],
  },
];

export const interaction = [
  {
    key: 'Security',
    description: _tHTML('1MQMGisohamuwEbecBXPSZ'),
  },
  {
    key: 'Access',
    description: _tHTML('2mHvGzcKupPK41WbVAcVPj'),
  },
  {
    key: 'Anonymity',
    description: _tHTML('wgN21RDSsz8ejrjxjFVRUo'),
  },
  {
    key: 'Supported',
    description: _tHTML('ak4Lx8ymuHRtB73KfmfpWh'),
  },
  {
    key: 'Features',
    description: _tHTML('bLu6VUUji7ifa2ZDQSBEnc'),
  },
];

export const benefits = [
  {
    key: 'Complexity',
    description: _tHTML('gB1N3snQvyjtDugsBBzFyq'),
  },
  {
    key: 'Vulnerability',
    description: _tHTML('93RVzcYHsLpzdLqoXhjq1b'),
  },
  {
    key: 'Risks',
    description: _tHTML('jpn3NPZA7XH38CnUdBvnJx'),
  },
];

export const readings = [
  {
    id: 1,
    title: _t('veuzSNcccXeRzUtayBfcz6'),
    description: '',
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/what-is-a-crypto-wallet`),
    lgIcon: readlg1,
    smIcon: readsm1,
  },
  {
    id: 2,
    title: _t('67VMkKeSoaAkt67m49zu9w'),
    description: '',
    url: addLangToPath(`${KUCOIN_HOST}/learn/web3/how-to-set-up-a-metamask-wallet`),
    lgIcon: readlg2,
    smIcon: readsm2,
  },
  {
    id: 3,
    title: _t('8iJ4qWv6DXtFaeJGj7Mz25'),
    description: '',
    url: addLangToPath(`${KUCOIN_HOST}/learn/web3/guide-to-top-web3-wallets`),
    lgIcon: readlg3,
    smIcon: readsm3,
  },
  {
    id: 4,
    title: _t('819WSrncmDc2uXH6dyaEJP'),
    description: '',
    url: addLangToPath(`${KUCOIN_HOST}/blog/how-to-back-up-your-crypto-wallet-private-keys`),
    lgIcon: readlg4,
    smIcon: readsm4,
  },
  {
    id: 5,
    title: _t('maTsMD8FU2YTR9wmuVUFL6'),
    description: '',
    url: addLangToPath(
      `${KUCOIN_HOST}/learn/crypto/what-is-a-multi-sig-wallet-and-how-does-it-work`,
    ),
    lgIcon: readlg5,
    smIcon: readsm5,
  },
  {
    id: 6,
    title: _t('sCoNJDLP6eU4DYksXhmmYp'),
    description: '',
    url: addLangToPath(`${KUCOIN_HOST}/learn/web3/how-to-add-solana-sol-to-metamask`),
    lgIcon: readlg6,
    smIcon: readsm6,
  },
];

export const security = [
  {
    key: 'Private',
    description: _tHTML('eo9gCQgXyPVRAaRjaogwGM'),
  },
  {
    key: 'Security',
    description: _tHTML('kyMCMPo8R2XuQ5aKAWVerM'),
  },
  {
    key: 'Passwords',
    description: _tHTML('8EDTiPAEnCEAAeYKJzAHKA'),
  },
  {
    key: 'Authentication',
    description: _tHTML('kfk8gTtVDQ4MAwhr49rAR2', {
      url: addLangToPath(`${KUCOIN_HOST}/support/360014897913`),
    }),
  },
  {
    key: 'Phishing',
    description: _tHTML('dJ4N9JetkmFUgTYTvvo9k1', {
      url: addLangToPath(
        `${KUCOIN_HOST}/blog/phishing-attacks-how-to-recognize-them-and-avoid-crypto-scams`,
      ),
    }),
  },
  {
    key: 'Regularly',
    description: _tHTML('fRZbnDHRT6v7UEKnj6JBjh'),
  },
  {
    key: 'Wallet',
    description: _tHTML('rwe9Dv77a5nb4hHi4QXnHi'),
  },
  {
    key: 'Transaction',
    description: _tHTML('7W4pqszBstp64SHYMSHRCe'),
  },
  {
    key: 'Trusted',
    description: _tHTML('6qQ9ELKz49K2PHHiReeB61'),
  },
  {
    key: 'Informed',
    description: _tHTML('ggVDLSKzCXVtuvBegfZxcs'),
  },
];
