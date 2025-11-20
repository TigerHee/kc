/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import siteCfg from 'utils/siteConfig';
import Tabulation from 'components/Landing/Tabulation';
import DotListItem from 'components/Landing/DotListItem';

const { KUCOIN_HOST } = siteCfg;

export const Wrapper = styled.ul`
  margin-top: 24px;
  list-style: none;
`;

const Ul = styled.ul`
  margin: 0px;
  padding: 0px;
`;

const Cryptocurrencies = [
  {
    key: 'Storing',
    description: _tHTML('sKycD2DMu2wcu4Labw4wZG', {
      url: addLangToPath(`${KUCOIN_HOST}/price/BTC`),
      ethurl: addLangToPath(`${KUCOIN_HOST}/price/ETH`),
    }),
  },
  {
    key: 'Receiving',
    description: _tHTML('kkWC4L5pjxt94ZJxub91fR'),
  },
  {
    key: 'Tokens',
    description: _tHTML('iNHMF8HyTB5DuEyAvEx4Uh', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/token-swap`),
    }),
  },
];

const Participate = [
  {
    key: 'Services',
    description: _tHTML('hPpXbTGatjRLNMWW2ygf3Y', {
      url: addLangToPath(`${KUCOIN_HOST}/margin/v2/lend`),
      stakurl: addLangToPath(`${KUCOIN_HOST}/earn`),
      farmurl: addLangToPath(`${KUCOIN_HOST}/learn/glossary/yield-farming`),
    }),
  },
  {
    key: 'Investments',
    description: _tHTML('sP9q4dUbkrv8ZLyoXAifts'),
  },
];

const NFTs = [
  {
    key: 'Storing',
    description: _tHTML('5MFU2mVT9QHNLNGiRAE4bj'),
  },
  {
    key: 'Marketplaces',
    description: _tHTML('b3ys5KPLpEUFRiEn9N8tU4'),
  },
];

const Identity = [
  {
    key: 'Decentralized',
    description: _tHTML('n2aa5bWDY7kGwhRqn7t9rS', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/web3/five-best-decentralized-identity-did-projects`),
    }),
  },
  {
    key: 'dApps',
    description: _tHTML('nkAdUM7WoUVVRWHS9RzcVV'),
  },
];

const Config = [
  {
    key: 'Cryptocurrencies',
    title: _t('5JrcGu38pj5SBco1QTHvU2'),
    description: (
      <Ul>
        {Cryptocurrencies.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'Decentralized',
    title: _t('45Gyj6d7A3idn4iDbdkqwz'),
    description: (
      <React.Fragment>
        {_tHTML('6GSMVxc3T9MBPn4ndQugX9', {
          url: addLangToPath(`${KUCOIN_HOST}/learn/web3/top-decentralized-exchanges-dexs`),
          gameurl: addLangToPath(`${KUCOIN_HOST}/markets/gaming`),
        })}
      </React.Fragment>
    ),
  },
  {
    key: 'Participate',
    title: _t('vH3nX9mz8FeEXMBhePSb5Q'),
    description: (
      <Ul>
        {Participate.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'NFTs',
    title: _t('fhYkME93zYiw9jw5sCnwc2'),
    description: (
      <Ul>
        {NFTs.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'Smart',
    title: _t('7dqfWTMer1gNWJTwpmdDmR'),
    description: <React.Fragment>{_t('wrrU2RYrHWKTUjVm5u4S1F')}</React.Fragment>,
  },
  {
    key: 'DAOs',
    title: _t('kDuXhRnp1TeRAEtTuWU3kx'),
    description: <React.Fragment>{_t('wXPw2oVzu1qJD2AMeTCNJo')}</React.Fragment>,
  },
  {
    key: 'Identity',
    title: _t('srbPQ5FiFUzmgh9Xa9E1dB'),
    description: (
      <Ul>
        {Identity.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'Cross',
    title: _t('kjywzvXadRC7Jhn7UYN9q1'),
    description: <React.Fragment>{_t('3CWDEKUfH7Wy2zBaYeFqHA')}</React.Fragment>,
  },
  {
    key: 'Income',
    title: _t('43SngBp5vz1UuydDKs8w2z'),
    description: <React.Fragment>{_t('hKab9KomDpTJC5QPiPxAYq')}</React.Fragment>,
  },
];

export default () => {
  return (
    <Wrapper>
      {Config.map((item, index) => {
        return (
          <Tabulation
            num={index + 1}
            key={item.key}
            title={item.title}
            description={item.description}
          />
        );
      })}
    </Wrapper>
  );
};
