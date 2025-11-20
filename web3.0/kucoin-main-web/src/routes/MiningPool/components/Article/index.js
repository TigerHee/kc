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
  ImageWrapper,
  Image,
  ReadTitle,
} from './index.style';
import Tabulation from 'components/Landing/Tabulation';
import DotListItem from 'components/Landing/DotListItem';
import FAQs from 'components/Landing/FAQs';
import Reading from 'components/Landing/Reading';
import SignUpCard from 'components/Landing/SignUpCard';
import QRcode from 'components/Landing/QRcode';
import { tabulations, types, chooseBests, joinPools, faqs, readings } from './config';
import { anchors } from '../../config';
import miningpool from 'static/mining-pool/miningpool.gif';

const { KUCOIN_HOST } = siteCfg;

export default () => {
  const responsive = useResponsive();
  const { isLogin } = useSelector((state) => state.user);

  return (
    <Wrapper>
      <ElementWrapper name={anchors.question1.key}>
        <section>
          <Title>{anchors.question1.title}</Title>
          <Paragraph>{_t('sG7K92GNNf6kHoYFudgHVq')}</Paragraph>
          <Paragraph>
            {_tHTML('6eXiSRdWhwayamhvQoJ9B7', {
              url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/all-about-crypto-mining-how-to-start`),
            })}
          </Paragraph>
          <Paragraph>{_t('oUcAyHdTAj3HrfDkRCAbsZ')}</Paragraph>
          <Paragraph>{_t('8jg1FqEmJvVwkqiUuJFJxS')}</Paragraph>
          <Paragraph>
            {_tHTML('q2PuzNWLvYraYkDEDdWQ4q', { url: addLangToPath(`${KUCOIN_HOST}/price/BTC`) })}
          </Paragraph>
          <ImageWrapper>
            <Image src={miningpool} />
          </ImageWrapper>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question2.key}>
        <section>
          <Title>{anchors.question2.title}</Title>
          <ParagraphDes>{_t('1r4HGrWqhMau1dM76LQqu9')}</ParagraphDes>
          <ListWrapper>
            {tabulations.map((item, index) => {
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
      <ElementWrapper name={anchors.types.key}>
        <section>
          <Title>{anchors.types.title}</Title>
          <ParagraphDes>{_t('o9Cb5yG7LrsPr3qAP5wUJ8')}</ParagraphDes>
          <ListWrapper>
            {types.map((item, index) => {
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
      <ElementWrapper name={anchors.question3.key}>
        <section>
          <Title>{anchors.question3.title}</Title>
          <ParagraphDes>{_t('cNeq632n1YNYLyKu1baEcw')}</ParagraphDes>
          <ListWrapper needBottomSpace>
            {chooseBests.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
          <ParagraphDes>{_t('u2reUf8QY121ZaSD4pdNwB')}</ParagraphDes>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question4.key}>
        <section>
          <Title>{anchors.question4.title}</Title>
          <ParagraphDes>{_t('koarMdrHPFEiLgyTCo9nHn')}</ParagraphDes>
          <ListWrapper needBottomSpace>
            {joinPools.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
          <ParagraphDes>{_t('kmrot1X8cHfCfxQHjWQYox')}</ParagraphDes>
          </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.FAQ.key}>
        <section>
          <Title>{anchors.FAQ.title}</Title>
          <FAQs faqs={faqs} />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.read.key}>
        <section>
          <ReadTitle>{anchors.read.title}</ReadTitle>
          <Reading list={readings} />
        </section>
      </ElementWrapper>
      {!isLogin && !responsive.sm && <SignUpCard signupBlockid="miningpoolsignup1" />}
      {!responsive.sm && <QRcode />}
    </Wrapper>
  );
};
