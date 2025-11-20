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

const CryptographicKeys = [
  {
    key: 'PublicKey',
    description: _tHTML('99k7WVk3eymfiacNiM2JLv', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/public-key`),
      dappsurl: addLangToPath(`${KUCOIN_HOST}/learn/glossary/dapp`),
      url2: addLangToPath(`${KUCOIN_HOST}/learn/glossary/private-key`),
    }),
  },
  {
    key: 'PrivateKey',
    description: _tHTML('e3cdUJWkdAUULwkUAzBC4q'),
  },
];

const Tokens = [
  {
    key: 'transaction',
    description: _t('pGdpnC7HopjECFvjiPhbka'),
  },
  {
    key: 'wallet',
    description: _t('h5XRkntguLfMtrUDdLjGqF'),
  },
  {
    key: 'blockchain',
    description: _t('42TbKaU9ra6oMPRuFrWbc6'),
  },
];

const Smarts = [
  {
    key: 'blockchain',
    description: _tHTML('qoqSDbP9TAhghCA9jH7wGx', {
      url: addLangToPath(`${KUCOIN_HOST}/markets/defi`),
    }),
  },
  {
    key: 'wallet',
    description: _tHTML('dheaJoVEUos9fNE29izDMV', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/smart-contract`),
    }),
  },
];

const Security = [
  {
    key: 'accounts ',
    description: _t('1wBo6J5qEuW7er8uTWDnPN'),
  },
  {
    key: 'security ',
    description: _tHTML('8rtF6ukeQdLXqMpTT31yGY', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/seed-phrase`),
    }),
  },
];

const Config = [
  {
    key: 'Keys',
    title: _t('4uUp9StQ9HE6zGew4JNbAG'),
    description: (
      <Ul>
        {CryptographicKeys.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'Address',
    title: _t('cXp6c5hibRRsaTy7YqH1pG'),
    description: <React.Fragment>{_t('8RosXYny1nFpCkLskNJtNQ')}</React.Fragment>,
  },
  {
    key: 'Blockchains',
    title: _t('2NgoQzXGs1kfQAo5L6NHxv'),
    description: <React.Fragment>{_t('cYPxCcdTiCQkuZg216uNRS')}</React.Fragment>,
  },
  {
    key: 'Tokens',
    title: _t('aWx1wUtLfPWxXtEL2DYTHC'),
    description: (
      <Ul>
        {Tokens.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'Smart',
    title: _t('kjkFzXiankR2riZFA7zj35'),
    description: (
      <Ul>
        {Smarts.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'Security',
    title: _t('4MdK59kWvdpsx2QgdDPQN8'),
    description: (
      <Ul>
        {Security.map((item, index) => {
          return <DotListItem num={index + 1} key={item.key} description={item.description} />;
        })}
      </Ul>
    ),
  },
  {
    key: 'User',
    title: _t('32DsrfXfeTMBntB9nh69bj'),
    description: <React.Fragment>{_t('gZzk6AMmoDotGWpPRtfmEn')}</React.Fragment>,
  },
  {
    key: 'Fees',
    title: _t('kjbXbxgpWsruDfBnjmt5Ce'),
    description: (
      <React.Fragment>
        {_tHTML('bTPJiUVFS93Ea3vBeRwWuD', {
          url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/gas-fees`),
          minerurl: addLangToPath(
            `${KUCOIN_HOST}/learn/crypto/all-about-crypto-mining-how-to-start`,
          ),
          validatorurl: addLangToPath(`${KUCOIN_HOST}/learn/glossary/validator`),
        })}
      </React.Fragment>
    ),
  },
  {
    key: 'Support',
    title: _t('iREPTZgodfwYpzeQbzpzqJ'),
    description: (
      <React.Fragment>
        {_tHTML('sHyyMaXS8WAFCc8JWybnWD', {
          url: addLangToPath(`${KUCOIN_HOST}/learn/web3/how-to-set-up-a-metamask-wallet`),
        })}
      </React.Fragment>
    ),
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
