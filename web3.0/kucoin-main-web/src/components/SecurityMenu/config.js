/**
 * Owner: larvide.peng@kupotech.com
 */

import SecurityImg from 'static/securityV2/light/security.png';
import YoutobeImg from 'static/securityV2/light/youtube.png';
import Google from 'static/securityV2/light/google.png';
import accountImg from 'static/securityV2/light/account.png';
import assetsImg from 'static/securityV2/light/assets.png';
import dataImg from 'static/securityV2/light/data.png';
import systemImg from 'static/securityV2/light/system.png';
import operationImg from 'static/securityV2/light/operation.png';
import eduImg from 'static/securityV2/light/edu.png';
import proofImg from 'static/securityV2/light/proof.png';
import darkAccountImg from 'static/securityV2/dark/account.png';
import darkAssetsImg from 'static/securityV2/dark/assets.png';
import darkDataImg from 'static/securityV2/dark/data.png';
import darkSystemImg from 'static/securityV2/dark/system.png';
import darkOperationImg from 'static/securityV2/dark/operation.png';
import darkEduImg from 'static/securityV2/dark/edu.png';
import darkProofImg from 'static/securityV2/dark/proof.png';

import { tenantConfig } from 'config/tenant';

export const NEWSLIST = [
  {
    tag: 'seW4L55KGkiG6GCJiPeHyw',
    type: 'Anti_FUD',
    news: [
      {
        images: '',
        title: '',
        key: 'tips-sharing-from-experienced-traders-this-is-how-i-recognize-and-avoid-fud',
        path: '/tips-sharing-from-experienced-traders-this-is-how-i-recognize-and-avoid-fud',
      },
      {
        images: '',
        title: '',
        key: 'anti-fud-101-watch-out-this-is-how-fuders-lead-you-by-the-nose',
        path: '/anti-fud-101-watch-out-this-is-how-fuders-lead-you-by-the-nose',
      },
      {
        images: '',
        title: '',
        key: 'anti-fud-101-everything-you-need-to-know-about-fud-in-crypto',
        path: '/anti-fud-101-everything-you-need-to-know-about-fud-in-crypto',
      },
    ],
  },
  {
    tag: 'fwy3kU5GnS3zBs1JNm52Cr',
    type: 'Crypto_Scams',
    news: [
      {
        images: '',
        title: '',
        key: 'phishing-attacks-how-to-recognize-them-and-avoid-crypto-scams',
        path: '/phishing-attacks-how-to-recognize-them-and-avoid-crypto-scams',
      },
      {
        images: '',
        title: '',
        key: 'how-to-protect-your-mobile-device-from-crypto-scams',
        path: '/how-to-protect-your-mobile-device-from-crypto-scams',
      },
      {
        images: '',
        title: '',
        key: '5-general-security-considerations-every-crypto-investor-should-know',
        path: '/5-general-security-considerations-every-crypto-investor-should-know',
      },
      {
        images: [SecurityImg],
        title: 'KuCoin Security Notice',
        path: '/support/360015207473',
      },
      {
        images: [
          'https://i.ytimg.com/vi/qjxmjqz_2LY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLCvn2fDIokGHmoQYfLJIcqTbCdf0A',
        ],
        title:
          'Key Learnings from Solana & Nomad Hacks & Top Anti-phishing Security Tips You Should Know on KuCoin',
        path: 'https://www.youtube.com/watch?v=qjxmjqz_2LY',
      },
      {
        images: [YoutobeImg],
        title: 'Top tips on how to avoid crypto scams',
        path: 'https://www.youtube.com/watch?v=N_rrmHD8gF8&t=61s',
      },
    ],
  },
  {
    tag: 'mnG1dcHkwxKsBrXRsYBsf7',
    type: 'Account_Security',
    news: [
      {
        images: '',
        title: '',
        key: 'everything-you-need-to-know-about-account-security-on-kucoin',
        path: '/everything-you-need-to-know-about-account-security-on-kucoin',
      },
      {
        images: '',
        title: '',
        key: 'the-importance-of-kyc-in-crypto-user-information-security',
        path: '/the-importance-of-kyc-in-crypto-user-information-security',
      },
      {
        images: [Google],
        title: 'How to set Google 2FA on KuCoin',
        path: '/support/360014897913',
      },
    ],
  },
  {
    tag: 'aay3UcXTv15qgg7tuejAvU',
    type: 'Crypto_Wallet',
    news: [
      {
        images: '',
        title: '',
        key: 'kucoin-officially-launches-decentralized-crypto-wallet-to-offer-users-web-3.0-services',
        path: '/kucoin-officially-launches-decentralized-crypto-wallet-to-offer-users-web-3.0-services',
      },
      {
        images: '',
        title: '',
        key: 'the-safest-way-to-hold-cryptocurrencies',
        path: '/the-safest-way-to-hold-cryptocurrencies',
      },
      {
        images: '',
        title: '',
        key: 'the-difference-between-custodial-and-non-custodial-crypto-wallets',
        path: '/the-difference-between-custodial-and-non-custodial-crypto-wallets',
      },
      {
        images: '',
        title: '',
        key: 'the-usage-of-hardware-wallets-in-crypto',
        path: '/the-usage-of-hardware-wallets-in-crypto',
      },
    ],
  },
];

export const articles = [
  {
    id: '1',
    mode: 'left',
    type: 'category',
    path: '/security/account-security#1-1',
    title: '6466d82f9d854000a50f', // 用户账户安全,
    desc: '73a9758b70d94000a458', // 通过多维身份认证、终端设备保护等保障用户账号安全
    coverLight: accountImg,
    coverDark: darkAccountImg,
    articleNavigation: {
      prev: false,
      next: true,
    },
    children: [
      {
        id: '1-1',
        title: '14d2d92111ca4000a582', // 身份验证
        path: '/security/account-security#1-1',
        type: 'article',
        children: [
          {
            id: '1-1-1',
            title: '60eebc7163394000a8d2',
            content: 'e33cc27873fc4000a9b0',
          },
          {
            id: '1-1-2',
            title: '26fb5c25550e4000a841',
            content: 'f3befe03e4364000a82e',
          },
          {
            id: '1-1-3',
            title: '683c57456cbe4000a9e0',
            content: '321ce014cb654000a590',
          },
          {
            id: '1-1-4',
            title: 'b0994658e9424000a14d',
            content: 'e8a09addb9604000a292',
          },
          {
            id: '1-1-5',
            title: '9bb956f7b7d74000a302',
            content: '585d5294560b4000a18e',
          },
        ],
      },
      {
        id: '1-2',
        title: '21c1e59867974000a038', // 防钓鱼邮件
        type: 'article',
        path: '/security/account-security#1-2',
        children: [
          {
            id: '1-2-1',
            title: '6bc8c5f82cbf4000a66c',
            content: 'f6fe83efb3fe4000a80e',
          },
          {
            id: '1-2-2',
            title: '84199231fbdc4000ac23',
            content: '9b49625b13694000aa6f',
          },
        ],
      },
      {
        id: '1-3',
        title: 'e2cee6871add4000aa4b', // 设备安全
        type: 'article',
        path: '/security/account-security#1-3',
        children: [
          {
            id: '1-3-1',
            title: '99b947d9491d4000a5c7',
            content: '3403f56639894000a367',
          },
          {
            id: '1-3-2',
            title: '589c9c7b85ed4000a369',
            content: 'd1f8cae16b5c4000a594',
          },
        ],
      },
      {
        id: '1-4',
        title: '52fe4d0713e54000a601', // 隐私保护
        type: 'article',
        path: '/security/account-security#1-4',
        children: [
          {
            id: '1-4-1',
            title: '',
            content: 'd066dc63b29d4000ae90',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    mode: 'right',
    type: 'category',
    title: 'fc5a3212ae234000a1cc', // 资金与钱包安全
    path: '/security/secure-your-funds-and-wallet#2-1',
    desc: '1b329fd0297b4000a61a',
    coverLight: assetsImg,
    coverDark: darkAssetsImg,
    otherLink: tenantConfig.security.showProof
      ? {
          iconLight: proofImg,
          iconDark: darkProofImg,
          title: 'cf83f2e674624000aa27',
          to: '/proof-of-reserves',
        }
      : null,
    articleNavigation: {
      prev: true,
      next: true,
    },
    children: [
      {
        id: '2-1',
        type: 'article',
        title: '64c543a5dc404000a872',
        path: '/security/secure-your-funds-and-wallet#2-1',
        children: [
          {
            id: '2-1-1',
            title: '64c543a5dc404000a872',
            content: '0a33962279e74000afd8',
          },
          {
            id: '2-1-2',
            title: '8f4f60de6d6f4000a816',
            content: '0ecd9d1b54c74000a915',
          },
        ],
      },
      {
        id: '2-2',
        type: 'article',
        title: '3634679c8a034000a337',
        path: '/security/secure-your-funds-and-wallet#2-2',
        children: [
          {
            id: '2-2-1',
            title: '3634679c8a034000a337',
            content: 'a9b72c3a46494000a10c',
          },
        ],
      },
      {
        id: '2-3',
        type: 'article',
        title: '8ecfb8ecf46f4000a596',
        path: '/security/secure-your-funds-and-wallet#2-3',
        children: [
          {
            id: '2-3-1',
            title: '1c2af897b47b4000af04',
            content: '82a0d0b406154000af8e',
          },
          {
            id: '2-3-2',
            title: 'b8256db18cb84000a2b7',
            content: '47246443798a4000a5d0',
          },
        ],
      },
      {
        id: '2-4',
        type: 'article',
        title: '7f08aa297a5a4000a49a',
        path: '/security/secure-your-funds-and-wallet#2-4',
        children: tenantConfig.security.showPor
          ? [
              {
                id: '2-4-1',
                title: '',
                content: '680c5c042df44000a849',
              },
              {
                id: '2-4-2',
                title: 'd54fd198ca814000a547',
                content: 'f2b84adc997e4000a9b4',
              },
              {
                id: '2-4-3',
                title: '3a6fb4c94de54000a64f',
                content: '7d1ae1bd0b1b4000a714',
              },
              {
                id: '2-4-4',
                title: '89899227042a4000a889',
                content: '1e2e54dc1e904000ac59',
              },
              {
                id: '2-4-5',
                title: '1c89bb7010de4000ab60',
                content: 'dd48f4e224f84000ad2b',
              },
            ]
          : [
              {
                id: '2-4-1',
                title: '',
                content: '680c5c042df44000a849',
              },
              {
                id: '2-4-2',
                title: 'd54fd198ca814000a547',
                content: 'f2b84adc997e4000a9b4',
              },
              {
                id: '2-4-3',
                title: '3a6fb4c94de54000a64f',
                content: '7d1ae1bd0b1b4000a714',
              },
              {
                id: '2-4-4',
                title: '89899227042a4000a889',
                content: '1e2e54dc1e904000ac59',
              },
            ],
      },
    ],
  },
  {
    id: '3',
    mode: 'left',
    type: 'category',
    title: 'dcb2178b256a4000a011', // 数据安全
    path: '/security/data-security#3-1',
    desc: 'fbe09e2daa034000a9fb',
    coverLight: dataImg,
    coverDark: darkDataImg,
    articleNavigation: {
      prev: true,
      next: true,
    },
    children: [
      {
        id: '3-1',
        type: 'article',
        title: '653778ff7f354000acdb',
        path: '/security/data-security#3-1',
        children: [
          {
            id: '3-1-1',
            title: '4a34d4b220e84000aef6',
            content: '52a9ff4cc7844000af8f',
          },
          {
            id: '3-1-2',
            title: '765a39ca04d04000afa3',
            content: '96ae3df671f24000ab05',
          },
        ],
      },
      {
        id: '3-2',
        type: 'article',
        title: 'ff15327180d74000a643',
        path: '/security/data-security#3-2',
        children: [
          {
            id: '3-2-1',
            title: 'ff15327180d74000a643',
            content: '70ad964ebc104000a6b4',
          },
        ],
      },
      {
        id: '3-3',
        type: 'article',
        title: '969274b779d14000ab7b',
        path: '/security/data-security#3-3',
        children: [
          {
            id: '3-3-1',
            title: '969274b779d14000ab7b',
            content: 'f04f212c6c864000ab3f',
          },
        ],
      },
      {
        id: '3-4',
        type: 'article',
        title: 'aacbf38b3c3f4000ad85',
        path: '/security/data-security#3-4',
        children: [
          {
            id: '3-3-1',
            title: 'aacbf38b3c3f4000ad85',
            content: '9cbbe23037a94000a595',
          },
        ],
      },
      {
        id: '3-5',
        type: 'article',
        title: 'c44a920dda8d4000afd9',
        path: '/security/data-security#3-5',
        children: [
          {
            id: '3-3-1',
            title: 'f919f92814284000a58e',
            content: 'a8c95b5ee1ea4000aebf',
          },
          {
            id: '3-3-2',
            title: '639c6bac39b14000a791',
            content: 'a9dae303ab5e4000a56d',
          },
        ],
      },
      {
        id: '3-6',
        type: 'article',
        title: '83708fe5505e4000a746',
        path: '/security/data-security#3-6',
        children: [
          {
            id: '3-3-1',
            title: '83708fe5505e4000a746',
            content: 'cd347bae69ff4000a260',
          },
        ],
      },
      {
        id: '3-7',
        type: 'article',
        title: '689c47f6e3ea4000a7c6',
        path: '/security/data-security#3-7',
        children: [
          {
            id: '3-3-1',
            title: 'd6ca9c9d77cc4000a26a',
            content: '91ff22cfdfae4000a6d9',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    mode: 'right',
    type: 'category',
    title: '249b26c772d44000aa5e', // 系统与应用安全
    path: '/security/system-and-app-security#4-1',
    desc: '8c54dd3bf3d74000a1f2',
    coverLight: systemImg,
    coverDark: darkSystemImg,
    articleNavigation: {
      prev: true,
      next: true,
    },
    children: [
      {
        id: '4-1',
        type: 'article',
        title: '16c6efa315f44000a129',
        path: '/security/system-and-app-security#4-1',
        children: [
          {
            id: '4-1-1',
            title: '70e392aba2f74000acfc',
            content: '98acee1e18524000af2e',
          },
          {
            id: '4-1-2',
            title: 'a840f10cc4cf4000a46e',
            content: '2c2cc139133a4000a2d3',
          },
          {
            id: '4-1-3',
            title: 'df37a56751814000ae8e',
            content: 'a775e0c384f34000a3a8',
          },
          {
            id: '4-1-4',
            title: '3a000f8ef60a4000aa82',
            content: '69fd093b821d4000a786',
          },
          {
            id: '4-1-5',
            title: 'cb13a680d3394000ad3c',
            content: 'a3ad8ebe7d904000af8e',
          },
        ],
      },
      {
        id: '4-2',
        type: 'article',
        title: 'f13dde558c1e4000a40b',
        path: '/security/system-and-app-security#4-2',
        children: [
          {
            id: '4-2-1',
            title: 'bef21bfeeb604000a038',
            content: '65982dcd57124000a413',
          },
          {
            id: '4-2-2',
            title: '5ff92efa093d4000a927',
            content: '0121c3b9022b4000ae98',
          },
          {
            id: '4-2-3',
            title: '182e53795bc54000a97a',
            content: '7afa88394be34000af95',
          },
          {
            id: '4-2-4',
            title: '4841b1b1c0614000a21f',
            content: 'b084ed8a7f2f4000a34f',
          },
        ],
      },
      {
        id: '4-3',
        type: 'article',
        title: 'f28d189c4db14000a9ab',
        path: '/security/system-and-app-security#4-3',
        children: [
          {
            id: '4-3-1',
            title: 'f28d189c4db14000a9ab',
            content: tenantConfig.security.showBountyProgram
              ? '5db4ec444dc34000ad7b'
              : 'f2966969ff594800a7a2',
          },
        ],
      },
      {
        id: '4-4',
        type: 'article',
        title: '9f45a4d243344000a4fa',
        path: '/security/system-and-app-security#4-4',
        children: [
          {
            id: '4-4-1',
            title: '9f45a4d243344000a4fa',
            content: tenantConfig.security.showBountyProgram
              ? '12d58c75018f4000a054'
              : '8a8d43d3bb784000a2ad',
          },
        ],
      },
    ],
  },
  {
    id: '5',
    mode: 'left',
    type: 'category',
    title: 'b5578c37828c4000a14d', // 平台与运营安全
    path: '/security/platform-and-operational-security#5-1',
    desc: 'ebfdad3579b04000af7d',
    coverLight: operationImg,
    coverDark: darkOperationImg,
    more: {
      href: 'security/platform-and-operational-security#5-1',
    },
    articleNavigation: {
      prev: true,
      next: true,
    },
    children: [
      {
        id: '5-1',
        type: 'article',
        title: 'ca07c31afdf34000a6b0', // 防火墙
        path: '/security/platform-and-operational-security#5-1',
        children: [
          {
            id: '5-1-1',
            title: 'ca07c31afdf34000a6b0',
            content: '74e09cae87404000a065',
          },
        ],
      },
      {
        id: '5-2',
        type: 'article',
        title: 'b22a524296e34000a0f2',
        path: '/security/platform-and-operational-security#5-2',
        children: [
          {
            id: '5-2-1',
            title: 'b22a524296e34000a0f2',
            content: 'f6a0c27b7fe04000a1e2',
          },
        ],
      },
      {
        id: '5-3',
        type: 'article',
        title: '0ee37ae236c04000a2e4',
        path: '/security/platform-and-operational-security#5-3',
        children: [
          {
            id: '5-3-1',
            title: '0ee37ae236c04000a2e4',
            content: '2201a26742664000a0b5',
          },
        ],
      },
      {
        id: '5-4',
        type: 'article',
        title: '93515e63f9a64000a1f4',
        path: '/security/platform-and-operational-security#5-4',
        children: [
          {
            id: '5-4-1',
            title: '93515e63f9a64000a1f4',
            content: '06825984b82f4000a4db',
          },
        ],
      },
      {
        id: '5-5',
        type: 'article',
        title: 'cc2484732df34000a0fd',
        path: '/security/platform-and-operational-security#5-5',
        children: [
          {
            id: '5-5-1',
            title: 'cc2484732df34000a0fd',
            content: 'b6017bb231a54000a32f',
          },
        ],
      },
      {
        id: '5-6',
        type: 'article',
        title: 'bd4049b51bde4000a117',
        path: '/security/platform-and-operational-security#5-6',
        children: [
          {
            id: '5-6-1',
            title: 'bd4049b51bde4000a117',
            content: '3fd3110bedf24000a0a0',
          },
        ],
      },
      {
        id: '5-7',
        type: 'article',
        title: 'c2eecc41a3634000a195',
        path: '/security/platform-and-operational-security#5-7',
        children: [
          {
            id: '5-7-1',
            title: 'c2eecc41a3634000a195',
            content: '9bedd0200f824000a39c',
          },
        ],
      },
      {
        id: '5-8',
        type: 'article',
        title: '5e1bf79453204000a711',
        path: '/security/platform-and-operational-security#5-8',
        children: [
          {
            id: '5-8-1',
            title: '5e1bf79453204000a711',
            content: 'c0c8227aee4d4000ada5',
          },
        ],
      },
      {
        id: '5-9',
        type: 'article',
        title: 'c6fb367612f54000aceb',
        path: '/security/platform-and-operational-security#5-9',
        children: [
          {
            id: '5-9-1',
            title: 'c6fb367612f54000aceb',
            content: '6c1689d1b2394000a983',
          },
        ],
      },
      {
        id: '5-10',
        type: 'article',
        title: '4d6f806a21e44000a60d',
        path: '/security/platform-and-operational-security#5-10',
        children: [
          {
            id: '5-10-1',
            title: '4d6f806a21e44000a60d',
            content: '72eec5542bc34000ad18',
          },
        ],
      },
      {
        id: '5-11',
        type: 'article',
        title: 'c4ff7e389fba4000ac35',
        path: '/security/platform-and-operational-security#5-11',
        children: [
          {
            id: '5-11-1',
            title: 'c4ff7e389fba4000ac35',
            content: '9714bcf9f64d4000a55b',
          },
        ],
      },
    ],
  },
  {
    id: '6',
    mode: 'right',
    type: 'category',
    title: '371136b550014000a608', // 安全文化与教育
    path: '/security/culture-of-security-and-education#6-1', // 安全文化与教育
    desc: '4c260ca813a84000a0cc',
    coverLight: eduImg,
    coverDark: darkEduImg,
    articleNavigation: {
      prev: true,
      next: false,
    },
    children: [
      {
        id: '6-1',
        type: 'article',
        title: '67320528ac6f4000a966', // 安全培训与测试
        path: '/security/culture-of-security-and-education#6-1',
        children: [
          {
            id: '6-1-1',
            title: '67320528ac6f4000a966',
            content: '73ffb799d2164000a78c',
          },
        ],
      },
      {
        id: '6-2',
        type: 'article',
        title: '884569c0fafc4000a424',
        path: '/security/culture-of-security-and-education#6-2',
        children: [
          {
            id: '6-2-1',
            title: '884569c0fafc4000a424',
            content: '99f11beaaa364000a3d8',
          },
        ],
      },
      {
        id: '6-3',
        type: 'article',
        title: '64e6a5d7a0944000a95b',
        path: '/security/culture-of-security-and-education#6-3',
        children: [
          {
            id: '6-3-1',
            title: '64e6a5d7a0944000a95b',
            content: 'ebfd977f7d134000a37b',
          },
        ],
      },
    ],
  },
];

// 递归 articles，返回所有带 content 的 article，用于搜索
const getCanSearchArticles = () => {
  const result = [];
  const recursion = (article) => {
    if ((article.type === 'article' || article.type === 'category') && article.title) {
      result.push(article);
    }
    if (article.children) {
      article.children.forEach((child) => {
        recursion(child);
      });
    }
  };
  articles.forEach((article) => {
    recursion(article);
  });
  return result;
};

export const canSearchArticles = getCanSearchArticles();
