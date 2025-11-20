/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { useResponsive } from '@kux/mui';
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
import DotListItem from 'components/Landing/DotListItem';
import FAQs from 'components/Landing/FAQs';
import SignUpCard from 'components/Landing/SignUpCard';
import QRcode from 'components/Landing/QRcode';
import copytrading from 'static/copy-trading/copytrading.png';
import { anchors, faqs, reasons, rightCrypto, risks, tricks } from './config';
import CopyTable from './CopyTable';
import { Image } from './index.style';

const { KUCOIN_HOST } = siteCfg;

export default () => {
  const responsive = useResponsive();
  const { isLogin } = useSelector((state) => state.user);

  return (
    <Wrapper>
      <ElementWrapper name={anchors.question0.key}>
        <section>
          <Title>{anchors.question0.title}</Title>
          <Paragraph>{_t('ieqRNL6os6gVHhcaty673r')}</Paragraph>
          <Paragraph>
            {_tHTML('ccvs6VV8HT1isa4d7K2RGs', {
              basiclurl: addLangToPath(
                `${KUCOIN_HOST}/learn/trading/beginners-guide-to-cryptocurrency-fundamental-analysis`,
              ),
              url: addLangToPath(
                `${KUCOIN_HOST}/learn/trading/sentiment-analysis-in-crypto-trading-a-beginners-guide`,
              ),
              tradeurl: addLangToPath(
                `${KUCOIN_HOST}/learn/trading/crypto-trading-vs-traditional-trading`,
              ),
            })}
          </Paragraph>
          <Paragraph>{_t('iYuehLeya56yegyME2G4ES')}</Paragraph>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question1.key}>
        <section>
          <Title>{anchors.question1.title}</Title>
          <Image src={copytrading} alt="image" />
          <Paragraph>{_t('updsThXXm6bpB9GGgqzZxH')}</Paragraph>
          <Paragraph>
            {_tHTML('dVErDKiKeaZrzaSBAFR61B', {
              priceurl: addLangToPath(`${KUCOIN_HOST}/price/USDT`),
              buyurl: addLangToPath(`${KUCOIN_HOST}/how-to-buy/bitcoin`),
              ethurl: addLangToPath(`${KUCOIN_HOST}/price/ETH`),
            })}
          </Paragraph>
          <Paragraph>{_t('d2Bnq2ERW1pDJxUoCWqCCv')}</Paragraph>
          <ParagraphDes>{_t('7Dx7Ev5auMuoT1DXQsYkgp')}</ParagraphDes>
          <CopyTable />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question2.key}>
        <section>
          <Title>{anchors.question2.title}</Title>
          <ParagraphDes>{_t('695nZ8t7Ga9Bsxmx14ygzH')}</ParagraphDes>
          <ListWrapper needBottomSpace>
            {reasons.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question3.key}>
        <section>
          <Title>{anchors.question3.title}</Title>
          <ParagraphDes>{_t('eXbgbb31d2MhbmPsXHAw9E')}</ParagraphDes>
          <ListWrapper needBottomSpace>
            {rightCrypto.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.Events.key}>
        <section>
          <Title>{anchors.Events.title}</Title>
          <ParagraphDes>{_t('11tVGKDr5GUCTu4qwX5UVa')}</ParagraphDes>
          <ListWrapper>
            {risks.map((item, index) => {
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
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question4.key}>
        <section>
          <Title>{anchors.question4.title}</Title>
          <ParagraphDes>{_t('g2JzbrfLZTEY89QcGa9HSX')}</ParagraphDes>
          <ListWrapper needBottomSpace>
            {tricks.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
          <Paragraph>{_t('44jpSNFsmBfGKaBf1L3Prt')}</Paragraph>
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
