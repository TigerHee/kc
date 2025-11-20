/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { useResponsive, Button } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import siteCfg from 'utils/siteConfig';
import {
  Wrapper,
  Paragraph,
  Title,
  ElementWrapper,
  ParagraphDes,
  ListWrapper,
} from '../MiningPool/components/Article/index.style';
import Tabulation from 'components/Landing/Tabulation';
import FAQs from 'components/Landing/FAQs';
import SignUpCard from 'components/Landing/SignUpCard';
import QRcode from 'components/Landing/QRcode';
import Reading from 'components/Landing/Reading';
import eth from 'static/ethereum-upgrade/eth.png';
import { anchors, faqs, readings, efficient } from './config';
import PriceTable from './PriceTable';
import VSTable from './VSTable';
import { Image, BtnWrapper } from './index.style';

const { KUCOIN_HOST } = siteCfg;

export default () => {
  const responsive = useResponsive();
  const { isLogin } = useSelector((state) => state.user);

  return (
    <Wrapper>
      <ElementWrapper name={anchors.question1.key}>
        <section>
          <Title>{anchors.question1.title}</Title>
          <Paragraph>
            {_tHTML('rw5E4e7qdY2WBAmg3SZZ7t', {
              ethurl: addLangToPath(`${KUCOIN_HOST}/price/ETH`),
              proofurl: addLangToPath(`${KUCOIN_HOST}/learn/glossary/proof-of-work-pow`),
              url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/consensus-mechanism`),
              stakeurl: addLangToPath(`${KUCOIN_HOST}/learn/glossary/proof-of-stake-pos`),
            })}
          </Paragraph>
          <Paragraph>{_tHTML('jvqjKwwXHkdSCwb9mpF5Ei')}</Paragraph>
          <Paragraph>{_t('q1PW9RkfmqxFDXqywnVciR')}</Paragraph>
          <BtnWrapper>
            <Button as="a" href={addLangToPath(`${KUCOIN_HOST}/price/ETH`)}>
              {_t('424x2Dn9wCUcC2c2tavcrX')}
            </Button>
          </BtnWrapper>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question2.key}>
        <section>
          <Title>{anchors.question2.title}</Title>
          <Image src={eth} alt="image" />
          <ParagraphDes>
            {_tHTML('uBWHLATbKyNFVmryvLVJ7S', {
              ethurl: addLangToPath(`${KUCOIN_HOST}/learn/glossary/beacon-chain`),
            })}
          </ParagraphDes>
          <ListWrapper needBottomSpace>
            {efficient.map((item, index) => {
              return (
                <Tabulation
                  num={index + 1}
                  key={item.key}
                  title={item.title}
                  description={item.description}
                />
              );
            })}
          </ListWrapper>
          <BtnWrapper>
            <Button as="a" href={addLangToPath(`${KUCOIN_HOST}/how-to-buy/ethereum`)}>
              {_t('wcikAaPGgPCTXuDsfZqJyZ')}
            </Button>
          </BtnWrapper>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question3.key}>
        <section>
          <Title>{anchors.question3.title}</Title>
          <ParagraphDes>
            {_tHTML('3i5g2Udx93b1CAFMW1HEjW', {
              url: addLangToPath(`${KUCOIN_HOST}/blog/ethereum-proof-of-work-vs-proof-of-stake`),
            })}
          </ParagraphDes>
          <VSTable />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.Events.key}>
        <section>
          <Title>{anchors.Events.title}</Title>
          <PriceTable />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.reading.key}>
        <section>
          <Title>{anchors.reading.title}</Title>
          <ParagraphDes>{_t('nBdi4Cek3qK7TBhU7Xn8j8')}</ParagraphDes>
          <Reading list={readings} />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.FAQ.key}>
        <section>
          <Title>{anchors.FAQ.title}</Title>
          <FAQs faqs={faqs} />
        </section>
      </ElementWrapper>
      {!isLogin && !responsive.sm && <SignUpCard />}
      {!responsive.sm && <QRcode />}
    </Wrapper>
  );
};
