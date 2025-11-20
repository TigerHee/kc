/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { getLinkByScene, PROMOTION_UTM_SOURCE } from 'components/$/MarketCommon/config';
import {
  FASTCOIN_HOST_COM,
  KUCOIN_HOST_COM,
  KUMEX_HOST_COM,
  TRADE_HOST_COM,
  TRADING_BOT_HOST_COM,
  POOLX_HOST_COM,
} from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import insImg from 'assets/consensus/bins.png';
import partnerImg from 'assets/consensus/partner.png';

const getUrl = (url, HOST_PREFIX = KUCOIN_HOST_COM) => {
  return addLangToPath(`${HOST_PREFIX}${url}`);
};

const getUrlWithParam = (url, HOST_PREFIX = KUCOIN_HOST_COM) => {
  return getLinkByScene({
    utm_source: PROMOTION_UTM_SOURCE,
    scene: 'gotoRegister',
    needConvertedUrl: addLangToPath(`${HOST_PREFIX}${url}${window.location.search}`),
  });
};

export const SWITCH_TAB_MAP = [
  {
    label: 'Individual Investors',
    title1: 'TRADE',
    list1: [
      {
        title: 'Fiat Trading',
        desc: ['Prompt Fiat-To-Crypto transfer service with 50+ fiats'],
        link: {
          url: getUrl('/assets/payments'),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/assets/payments');
            window.open(url,"_blank");
          },
          text: 'Buy Crypto',
        },
      },
      {
        title: 'Spot Trading',
        desc: ['Support 700+ quality assets with high liquidity'],
        link: {
          url: getUrl('/BTC-USDT', TRADE_HOST_COM),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/BTC-USDT', TRADE_HOST_COM);
            window.open(url,"_blank");
          },
          text: 'Trade Now',
        },
      },
      {
        title: 'Margin Trading',
        desc: ['Magnify profits with up to 10x leverage'],
        link: {
          url: getUrl('/margin/BTC-USDT', TRADE_HOST_COM),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/margin/BTC-USDT', TRADE_HOST_COM);
            window.open(url,"_blank");
          },
          text: 'Trade Now',
        },
      },
      {
        title: 'Trading Bot',
        desc: ['Earn passive profits without monitoring the market'],
        link: {
          url: getUrl('', TRADING_BOT_HOST_COM),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('', TRADING_BOT_HOST_COM);
            window.open(url,"_blank");
          },
          text: 'Create Now',
        },
      },
    ],
    title2: 'Derivatives',
    list2: [
      {
        title: 'Futures Trading',
        desc: ['Comprehensive trading tools with up to 100x leverage'],
        link: {
          url: getUrl('/trade/XBTUSDTM', KUMEX_HOST_COM),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/trade/XBTUSDTM', KUMEX_HOST_COM);
            window.open(url,"_blank");
          },
          text: 'Trade Now',
        },
      },
      {
        title: 'Leveraged Token',
        desc: ['Increased leverage, no loans, and no liquidations'],
        link: {
          url: getUrl('/leveraged-tokens'),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/leveraged-tokens');
            window.open(url,"_blank");
          },
          text: 'Trade Now',
        },
      },
    ],
    title3: 'Earn',
    list3: [
      {
        title: 'Crypto Lending',
        desc: ['Lend your crypto to earn a stable passive income'],
        link: {
          url: getUrl('/margin/lend'),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/margin/lend');
            window.open(url,"_blank");
          },
          text: 'Buy Now',
        },
      },
      {
        title: 'Spotlight',
        desc: ['A launchpad for hidden gems, earn more by investing earlier'],
        link: {
          url: getUrl('/spotlight-center'),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/spotlight-center');
            window.open(url,"_blank");
          },
          text: 'Participate Now',
        },
      },
      {
        title: `${window._BRAND_NAME_} Earn`,
        desc: ['Professional asset management with 60+ coins supported'],
        link: {
          url: getUrl('', POOLX_HOST_COM),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('', POOLX_HOST_COM);
            window.open(url,"_blank");
          },
          text: 'Subscribe Now',
        },
      },
      {
        title: `${window._BRAND_NAME_} Pool`,
        desc: ['One-stop platform for global miners with the lowest mining fee'],
        link: {
          url: getUrl('/mining-pool'),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/mining-pool');
            window.open(url,"_blank");
          },
          text: 'Mine Now',
        },
      },
      {
        title: 'KCS Bonus',
        desc: ['Hold at least 6 KCS to get a daily bonus'],
        link: {
          url: getUrl('/KCS-USDT', TRADE_HOST_COM),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/KCS-USDT', TRADE_HOST_COM);
            window.open(url,"_blank");
          },
          text: 'Claim Now',
        },
      },
      {
        title: 'Cloud Mining',
        desc: ['A newly-remote mining model. Easy mining, easy profits'],
        link: {
          url: getUrl('/cloud-mining'),
          onClick:(e)=>{
            e.preventDefault();
            const url = getUrlWithParam('/cloud-mining');
            window.open(url,"_blank");
          },
          text: 'Mine Now',
        },
      },
    ],
    title4: `Explore Endless Possibilities On ${window._BRAND_NAME_}`,
    list4: [
      {
        title: 'IGO',
        desc: ['A new interactive NFT Launchpad', 'Immersive experience in crypto gaming'],
      },
      {
        title: 'Windvane',
        desc: ['One-Stop decentralized NFT Marketplace', 'Trendy NFTs covering hot sectors'],
        link: {
          url: 'https://windvane.io/',
          text: 'Dive into NFTs',
        },
      },
    ],
  },
  {
    label: 'Institutional Investors',
    title: `${window._BRAND_NAME_} Provides First-Class Services for Institutional Investors`,
    list: [
      {
        title: 'High Liquidity',
        desc:
          `With 10 billion+ highest 24-hour trading volume, ${window._BRAND_NAME_} provides you with the best market depth in the world.`,
      },
      {
        title: 'Stable Trading System',
        desc:
          'The newly upgraded trading system provides the ultimate in spot/futures trading experience.',
      },
      {
        title: '1V1 Professional Services',
        desc: 'Tailor-made professional trading solutions for you.',
      },
      {
        title: 'Extremely Low Fee Rate',
        desc:
          'The optimal rate for the taker fee is as low as -0.005%, and only 0.02% for the maker fee.',
      },
      {
        title: 'Beyond VIP',
        desc:
          `Users who are VIPs on other platforms can enjoy VIP services of the corresponding level on ${window._BRAND_NAME_}.`,
      },
    ],
    imgSrc: insImg,
    tailText: 'Get in Touch:',
    tailLink: {
      url: 'mailto:mm@kucoin.com',
      text: 'mm@kucoin.com',
    },
  },
  {
    label: 'Listing',
    title: `List on ${window._BRAND_NAME_}, the Home of Hidden Gems`,
    list: [
      {
        title: 'A Gathering Place for Global Crypto Enthusiasts',
        desc: `${window._BRAND_NAME_} serves over 18 million crypto natives in 200+ countries and regions.`,
      },
      {
        title: 'A-list KOLs and 20+ Global Communities',
        desc:
          `${window._BRAND_NAME_} has more than 20 global communities and has reached cooperation with the world's top KOLs to gather more attention for start-up projects.`,
      },
      {
        title: 'Strong Brand Effect',
        desc:
          `As the world's top 5 trading platforms, ${window._BRAND_NAME_} provides a strong brand and market empowerment for start-up projects.`,
      },
      {
        title: 'In-depth Cooperation',
        desc:
          `In addition to listing, ${window._BRAND_NAME_} also helps the projects’ development by providing Staking, Saving, and Lending services of project tokens.`,
      },
    ],
    btnText: 'Apply for Listing',
    applyLink:
      'https://docs.google.com/forms/d/e/1FAIpQLSfoj8KW2kmDhAzs0HQ9chf2YXgzy7-UhfRA7KUmw0ZU73RdrQ/viewform',
  },
  {
    label: 'Partnership',
    title: `Stand by ${window._BRAND_NAME_} to Promote the Crypto Development And Bring it to the Masses`,
    list: [
      {
        title: `${window._BRAND_NAME_} Ventures`,
        desc:
          `${window._BRAND_NAME_} Ventures is a leading investment arm of ${window._BRAND_NAME_} that aims to invest in the most disruptive cryptocurrency and blockchain projects in the Web3.0 era.`,
        tailLinks: [
          {
            url: 'mailto:KCBP@corp.kucoin.com',
            text: `Contact ${window._BRAND_NAME_}`,
          },
        ],
      },
      {
        title: `${window._BRAND_NAME_} Creators Fund`,
        desc: `${window._BRAND_NAME_}'s $100 Million Creators Fund aims to help artists and creators to show their talents to the public and to build an open, free, equal, and decentralized NFT marketplace meanwhile.`,
        tailLinks: [
          {
            url:
              'https://docs.google.com/forms/d/e/1FAIpQLSe98e3wiPkqOBexZjY17zdvKbM3l_qDOqJckChNVNj-uP5Q9g/viewform',
            text: 'Apply Now',
          },
        ],
      },
      {
        title: `${window._BRAND_NAME_} Affiliate Program`,
        desc: `We are looking for affiliates who share ${window._BRAND_NAME_}'s values and mission and are willing to promote ${window._BRAND_NAME_}. You can invite your friends to join ${window._BRAND_NAME_} and earn up to 40% commissions.`,
        tailLinks: [
          {
            url:
              'https://forms.office.com/pages/responsepage.aspx?id=YXMsSAW7m0u2NHVBgPYiBJ9HPlVJHgZGjpYVCSUL5d5UMFVDMVU5VlRFODhCRjRKREZZTEY4VlNQNy4u',
            text: 'Apply Now',
          },
        ],
      },
      {
        title: 'P2P & OTC Cooperation',
        desc:
          `To provide users with a better channel of fiat currency and help more novice users use fiat currency to buy cryptocurrencies more easily, ${window._BRAND_NAME_} is recruiting high-quality P2P merchants for the global market, while expanding and building OTC business cooperation channels.`,
        tailLinks: [
          // {
          //   // url: 'https://www.kucoin.com/express/merchant',
          //   url: getUrl('/merchant', FASTCOIN_HOST_COM),
          //   text: 'Apply for P2P Merchant',
          // },
          {
            url: 'mailto:pierre@corp.kucoin.com',
            text: 'Contact Now',
          },
        ],
      },
      {
        title: 'Fiat Payment Cooperation',
        desc:
          `${window._BRAND_NAME_} is driving fiat payment solutions globally. We develop products for fiat on/off-ramps, such as alternative payment methods, card issuance, banking as a service, remittance & FX. ${window._BRAND_NAME_} Payments leads and executes targeted market launches with entire company set-ups, license applications, incorporation, staffing and regulatory compliance.`,
        tailLinks: [
          {
            url: 'mailto:payment@kucoin.com',
            text: 'Contact Now',
          },
        ],
      },

      {
        title: 'Fiat Liquidity Provider Program',
        desc:
          `Fiat-to-crypto trading pairs will available on ${window._BRAND_NAME_} and we are looking for qualified fiat market makers including individual investors, and institutions, such as High-Frequency Traders, Arbitrage Dealers, Crypto Wallets, Aggregators, and Trading Bot Service Providers`,
        tailLinks: [
          {
            url: 'mailto:Fiatmm@kucoin.com',
            text: 'Contact Now',
          },
        ],
      },
    ],
    imgSrc: partnerImg,
    tailText: 'For More Cooperation, Please Contact:',
    tailLink: {
      url: 'mailto:media@kucoin.com',
      text: 'media@kucoin.com',
    },
  },
  {
    label: 'Community',
    btnText: 'View More Projects',
    applyLink: 'http://discover.kcc.io',
    block1: {
      title: 'A Community for Everyone',
      list: [
        {
          title: 'Twitter',
          desc: '1.8M+ Followers',
        },
        {
          title: 'Global Community',
          desc: '900K+ Members',
        },
        {
          title: 'Country Covered',
          desc: '200+',
        },
      ],
    },
    block2: {
      title: `${window._BRAND_NAME_} Community Chain`,
      tailText: 'Get in Touch:',
      tailLink: {
        url: 'mailto:kcc-business@kcc.network',
        text: 'kcc-business@kcc.network',
      },
      part1: {
        title: `${window._BRAND_NAME_} Community Chain`,
        descs: [
          `KCC (${window._BRAND_NAME_} Community Chain) is a public chain project initiated and built by the developer community of KCS and ${window._BRAND_NAME_}, aiming to solve the network latency and high gas fee of Ethereum.`,
          'It is compatible with EVM and smart contracts and strives to provide community users and developers with a higher-speed, more convenient, and lower-cost blockchain experience.',
        ],
        tailLink: {
          url: 'https://www.kcc.io/',
          text: 'Learn More',
        },
      },
      part2: {
        title: 'KCC Ecosystem Statistics',
        descs: [
          ['DApp:', '60+'],
          ['Total Value Locked:', '$65 Million+'],
          ['Accumulated Number of Transactions:', '13 Million+'],
        ],
      },
      part3: {
        title: '$50 Million Ecosystem Incentive/Incubation Funds',
        descs: [
          [
            'KCC’s ecosystem accelerator program seeks to provide support to projects that are in different development phases.',
          ],
          [
            'The $50 Million Incentive includes 4 Phases',
            [
              'Builders’ Bounty',
              'Ecosystem wide project contests/Hackathon',
              'Project incubation fund',
              'Liquidity support',
            ],
          ],
        ],
        tailLink: {
          url:
            'https://kccofficial.medium.com/kcc-announces-50m-ecosystem-accelerator-program-43f65285f33b',
          text: 'Learn More',
        },
      },
    },
    block3: {
      title: 'Innovation Projects on KCC',
      list: [
        {
          desc:
            'MojitoSwap is the TOP 1 DEX on KCC, committed to providing the premium trading experience of tokens and NFTs, and also allowing users to earn more from Liquidity-mining and Launchpad.',
          link: {
            url:
              'https://gleam.io/competitions/DYWt4-mojitoswap-trading-competition-x-10000-mjt-giveaway',
            text: 'View More Activities',
          },
        },
        {
          desc:
            'Pikaster is a card battle game featuring Pikaster (NFT), the first Game-Fi project created by Metaland.',
          link: {
            url: 'https://marketplace.pikaster.com/invite',
            text: 'View More Activities',
          },
        },
      ],
    },
  },
];
