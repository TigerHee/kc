/**
 * Owner: ella.wang@kupotech.com
 */
import React from 'react';
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

export const anchors = {
  question1: {
    id: 1,
    key: 'question1',
    title: _t('rk9H6NWmVhtGicBjsGPgTQ'),
  },
  question2: {
    id: 2,
    key: 'question2',
    title: _t('r9eNhErSsdervgAm8aGcVm'),
  },
  question3: {
    id: 3,
    key: 'question3',
    title: _t('njsEbtpdmCHTaE4ukoCwGp'),
  },
  Events: {
    id: 4,
    key: 'Events',
    title: _t('7ber6iCpiDoY856UgjxXjs'),
  },
  reading: {
    id: 5,
    key: 'reading',
    title: _t('3L4z3mqXqXTc6QRS7yC1dj'),
  },
  FAQ: {
    id: 6,
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
    title: _t('wM1deUY6esmv8wcCguaGTy'),
    description: [_t('r5Cd6AVMHtCBiBhEH9Dymw')],
  },
  {
    title: _t('sVkesKwTqebrzbQzVaXt2b'),
    description: [_t('wL1cvDSJsubUbveLas7HjD')],
  },
  {
    title: _t('fj4N9u8jjGMdToK4aXhb99'),
    description: [_t('m2ZxhcgUTeRq2NTSkaCS6L')],
  },
  {
    title: _t('c24utE9SJV6HKKaoe7aAtG'),
    description: [_t('nrUuBd5mjr14jztBKDC8MD')],
  },
  {
    title: _t('esGycbivL8m6GPuHD8q9Y8'),
    description: [
      _tHTML('o95C11qJZV428e6XrZXv8A', {
        url: addLangToPath(
          `${KUCOIN_HOST}/learn/trading/sentiment-analysis-in-crypto-trading-a-beginners-guide`,
        ),
      }),
    ],
  },
];

export const readings = [
  {
    id: 1,
    title: _t('2QTQ6fNFeNNGU9jHzY1Gdt'),
    description: _t('ea53Zqg9SufXC3Uan7ex11'),
    url: addLangToPath(`${KUCOIN_HOST}/blog/everything-you-need-to-know-about-the-ethereum-merge`),
    lgIcon: readlg1,
    smIcon: readsm1,
  },
  {
    id: 2,
    title: _t('x5P3ypfuS5TKyzE72GNAjj'),
    description: _t('ghxvKuirr314iTbV33JF2k'),
    url: addLangToPath(`${KUCOIN_HOST}/blog/what-to-expect-from-ethereum-pow-after-eth-merge`),
    lgIcon: readlg2,
    smIcon: readsm2,
  },
  {
    id: 3,
    title: _t('gW3Md6GPMfcagaDCZns3fg'),
    description: _t('oKeWDfGYLR66o12WDtmyoh'),
    url: addLangToPath(`${KUCOIN_HOST}/blog/what-is-the-ethereum-shanghai-upgrade`),
    lgIcon: readlg3,
    smIcon: readsm3,
  },
  {
    id: 4,
    title: _t('12gUH6bKDNGEsRPGke21Ee'),
    description: _t('7SZCyXxAwDHHwhbVAgco25'),
    url: addLangToPath(
      `${KUCOIN_HOST}/blog/top-liquid-staking-protocols-on-ethereum-ahead-of-shanghai-upgrade`,
    ),
    lgIcon: readlg4,
    smIcon: readsm4,
  },
  {
    id: 5,
    title: _t('dgxmdYRp8c8s9zPmiKsc9w'),
    description: _t('cBtMERERqR8AmduwsiF8fq'),
    url: addLangToPath(`${KUCOIN_HOST}/blog/ethereum-2-0-roadmap-next-after-shanghai-upgrade`),
    lgIcon: readlg5,
    smIcon: readsm5,
  },
  {
    id: 6,
    title: _t('55Q2L79S5K47NEjrBeKmPA'),
    description: _t('n8Et7sZuzBYZ1eoQb7ur62'),
    url: addLangToPath(
      `${KUCOIN_HOST}/learn/crypto/ethereum-cancun-upgrade-what-to-expect-from-proto-danksharding`,
    ),
    lgIcon: readlg6,
    smIcon: readsm6,
  },
  {
    id: 7,
    title: _t('fnNVh6gWi8szRHnNTW1uDb'),
    description: _t('dy7zkXzhz7nRrpfATe9PLe'),
    url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/danksharding-explained-ethereum-2-sharding`),
    lgIcon: readlg7,
    smIcon: readsm7,
  },
];

export const efficient = [
  {
    key: 'BeaconChain',
    title: _t('fS2nK33jEnWrMjCAjhPD95'),
    description: <React.Fragment>{_t('4ArKhHrWWuyPMwveqGRjUM')}</React.Fragment>,
  },
  {
    key: 'Merge ',
    title: _t('orjyzYsvRScs4uNoY7WT7w'),
    description: (
      <React.Fragment>
        {_tHTML('nVs2oQtUrDD9a7CCq2gyg2', {
          mergeurl: addLangToPath(
            `${KUCOIN_HOST}/blog/everything-you-need-to-know-about-the-ethereum-merge`,
          ),
          url: addLangToPath(
            `${KUCOIN_HOST}/learn/crypto/blockchain-layer-1-vs-layer-2-scaling-solutions-explained`,
          ),
        })}
      </React.Fragment>
    ),
  },
  {
    key: 'Upgrade',
    title: _t('fa6hyxesZKxRpeHRFgfu7F'),
    description: (
      <React.Fragment>
        {_tHTML('cUcTs3UQjNCKViLLG1ReFE', {
          url: addLangToPath(`${KUCOIN_HOST}/blog/what-is-the-ethereum-shanghai-upgrade`),
        })}
      </React.Fragment>
    ),
  },
  {
    key: 'Ethereum',
    title: _t('2GF4bGnoAoG4KUDxpn7Ld7'),
    description: (
      <React.Fragment>
        {_tHTML('bJSGSzQJPofcxucs9NZe4P', {
          url: addLangToPath(
            `${KUCOIN_HOST}/learn/crypto/ethereum-cancun-upgrade-what-to-expect-from-proto-danksharding`,
          ),
        })}
      </React.Fragment>
    ),
  },
  {
    key: 'Danksharding ',
    title: _t('tcfXm5DhCGbuHJJMbZNkQa'),
    description: (
      <React.Fragment>
        {_tHTML('8XE9kJcHne1EKobFGSeutq', {
          url: addLangToPath(
            `${KUCOIN_HOST}/learn/crypto/danksharding-explained-ethereum-2-sharding`,
          ),
        })}
      </React.Fragment>
    ),
  },
];
