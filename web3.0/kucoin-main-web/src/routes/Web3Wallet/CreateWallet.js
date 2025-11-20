/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import siteCfg from 'utils/siteConfig';
import Tabulation from 'components/Landing/Tabulation';
import DotListItem from 'components/Landing/DotListItem';
import { ParagraphDes, Paragraph, ListWrapper } from '../MiningPool/components/Article/index.style';

const { KUCOIN_HOST } = siteCfg;

export const Wrapper = styled.div`
  margin-top: 24px;
`;

const ParagraphWrapper = styled.div`
  margin: 24px 0px 0px 0px;
`;

const type = [
  {
    key: 'Software',
    description: _tHTML('4zvcQvWSnX27gUCB4sq727'),
  },
  {
    key: 'Hardware',
    description: _tHTML('ntNYyb2tPYUruZ9BSEKA1A', {
      url: addLangToPath(`${KUCOIN_HOST}/blog/the-usage-of-hardware-wallets-in-crypto`),
    }),
  },
  {
    key: 'Web',
    description: _tHTML('4QD3EDk7x7dtyw5Z2AZBaJ'),
  },
];

const provider = [
  {
    key: 'hardware',
    description: _tHTML('bDMbBRsZMbfHEShiitztCR', {
      url: addLangToPath(`${KUCOIN_HOST}/learn/web3/how-to-set-up-a-metamask-wallet`),
    }),
  },
  {
    key: 'interface',
    description: _t('xokvxvTdsKL6aLbTaX86ZM'),
  },
];

const download = [
  {
    key: 'website',
    description: _t('udfP7w2YrWExqrmL6TyDJG'),
  },
  {
    key: 'application',
    description: _t('4GZwK6dCGRMAi6nqSNNG6G'),
  },
];

const hardware = [
  {
    key: 'hardware',
    description: _t('pTbnNV59F9VQ4WqjcaDQs2'),
  },
  {
    key: 'instructions',
    description: _t('rGdbZ6aYoVfe3CSh6Lhu4F'),
  },
];

const newWallet = [
  {
    key: 'open',
    description: _t('udpu1EsK8ZnRbJDs715fwL'),
  },
  {
    key: 'new',
    description: _t('rVrQmAnUEv7ryLHw3Gy8s1'),
  },
  {
    key: 'password',
    description: _t('gYvHWnWfXkBSsyQLKpZ5VA'),
  },
];

const secure = [
  {
    key: 'recovery',
    description: _t('nQDifNdABU8CZx8agcRXH2'),
  },
  {
    key: 'privately',
    description: _t('hY1mV7NyBKPFV28bksqVCL'),
  },
];

const deposit = [
  {
    key: 'address',
    description: _t('4SXSvNhQf7iUtrGVHuH3Sz'),
  },
  {
    key: 'exchange',
    description: _t('xjW9ZgrbKchz3p8vNKWxAo'),
  },
];

const blockchain = [
  {
    key: 'DApps',
    description: _t('fUA6YA8bfcBY9kyA2p8wNZ'),
  },
  {
    key: 'details',
    description: _t('wjMPrzFTWYmgSmR5Hefx5o'),
  },
];

const steps = [
  {
    key: 'Type',
    title: _t('5o9DjLdFC3sffxvmCKk6ZD'),
    description: (
      <React.Fragment>
        <ParagraphDes>{_t('9kEwsfnWEVWZrGz73ePPJw')}</ParagraphDes>
        <ListWrapper>
          {type.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
      </React.Fragment>
    ),
  },
  {
    key: 'Provider',
    title: _t('hUJwGExgeihbgGFB5C93VR'),
    description: (
      <React.Fragment>
        <ParagraphDes>{_t('6nmwhD2a2GVYuW3Na6LyUT')}</ParagraphDes>
        <ListWrapper>
          {provider.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
      </React.Fragment>
    ),
  },
  {
    key: 'Download',
    title: _t('c1tv7nkv4nw7yJEb23WnxZ'),
    description: (
      <React.Fragment>
        <ParagraphDes>{_t('kkEDcbhdrVrqzdJCpKqZ7o')}</ParagraphDes>
        <ListWrapper>
          {download.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
        <ParagraphDes>{_t('tKvFgegCXrA4SQ2NHbyfta')}</ParagraphDes>
        <ListWrapper>
          {hardware.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
      </React.Fragment>
    ),
  },
  {
    key: 'newWallet',
    title: _t('dKrTcYqTx9XXMYZvBSLDkd'),
    description: (
      <React.Fragment>
        <ParagraphDes>{_t('eA14pXPPvy7RzZnHWXeprq')}</ParagraphDes>
        <ListWrapper>
          {newWallet.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
      </React.Fragment>
    ),
  },
  {
    key: 'Secure',
    title: _t('kpdb2v5UTY79cts2ahfvRt'),
    description: (
      <React.Fragment>
        <ParagraphDes>{_t('3tAbPbL288xsoSmbkqcRAH')}</ParagraphDes>
        <ListWrapper>
          {secure.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
        <ParagraphWrapper>
          <ParagraphDes>{_t('cGUDD25TQirfN9LZUTjkUu')}</ParagraphDes>
          <Paragraph>{_t('74pCdy4XxWcanEgBj7Uo2v')}</Paragraph>
        </ParagraphWrapper>
      </React.Fragment>
    ),
  },
  {
    key: 'deposit',
    title: _t('nFtofnGcN1yPzmRTuVc4ZT'),
    description: (
      <React.Fragment>
        <ParagraphDes>{_t('wf4yA5QyeDVnjHcB1x2F3p')}</ParagraphDes>
        <ListWrapper>
          {deposit.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
      </React.Fragment>
    ),
  },
  {
    key: 'blockchain ',
    title: _t('nnnZUhjYtfMt7WFC5ZMnEq'),
    description: (
      <React.Fragment>
        <ParagraphDes>{_t('ac5bHv6VLrUeVXU6WbT88e')}</ParagraphDes>
        <ListWrapper>
          {blockchain.map((item, index) => {
            return <DotListItem num={index + 1} key={item.key} description={item.description} />;
          })}
        </ListWrapper>
      </React.Fragment>
    ),
  },
];

export default () => {
  return (
    <Wrapper>
      {steps.map((item, index) => {
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
