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
import DotListItem from 'components/Landing/DotListItem';
import FAQs from 'components/Landing/FAQs';
import SignUpCard from 'components/Landing/SignUpCard';
import QRcode from 'components/Landing/QRcode';
import Reading from 'components/Landing/Reading';
import { anchors, faqs, interaction, benefits, readings, security } from './config';
import wallet from 'static/web3-wallet/wallet.png';
import WalletsWork from './WalletsWork';
import Diverse from './Diverse';
import CreateWallet from './CreateWallet';
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
          <Paragraph>{_t('4xWZuVzoifKU1VA6oNbKao')}</Paragraph>
          <Paragraph>
            {_tHTML('4DXV8aqhsQ7g1XP9i95kRR', {
              url: addLangToPath(`${KUCOIN_HOST}/learn/crypto/what-is-a-crypto-wallet`),
              weburl: addLangToPath(
                `${KUCOIN_HOST}/learn/web3/what-is-web3-all-about-the-decentralized-internet`,
              ),
              secriturl: addLangToPath(`${KUCOIN_HOST}/learn/glossary/cryptocurrency`),
              nfturl: addLangToPath(`${KUCOIN_HOST}/markets/nft`),
            })}
          </Paragraph>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question1.key}>
        <section>
          <Title>{anchors.question1.title}</Title>
          <Paragraph>{_t('bY5W7bGzM9sZvFKrXQ2LGS')}</Paragraph>
          <Image src={wallet} alt="image" />
          <ParagraphDes>{_t('2G4rh5q8Ui7Cz4ABFYkGet')}</ParagraphDes>
          <WalletsWork />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question2.key}>
        <section>
          <Title>{anchors.question2.title}</Title>
          <Paragraph>{_t('mofppQJEAAoDhaHRrDtgA8')}</Paragraph>
          <ParagraphDes>{_t('5UJvVk8A2c1gz7H6iDvP8g')}</ParagraphDes>
          <ListWrapper needBottomSpace>
            {interaction.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
          <ParagraphDes>{_t('mQ8QVMpVgGiTvqFMEmk2fJ')}</ParagraphDes>
          <ListWrapper>
            {benefits.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question3.key}>
        <section>
          <Title>{anchors.question3.title}</Title>
          <ParagraphDes>{_t('ubReM48F649ZrqbmnV7wSq')}</ParagraphDes>
          <Diverse />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.Events.key}>
        <section>
          <Title>{anchors.Events.title}</Title>
          <ParagraphDes>{_t('9ybg8nNsJNUCDkcPwV8ncf')}</ParagraphDes>
          <CreateWallet />
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.question4.key}>
        <section>
          <Title>{anchors.question4.title}</Title>
          <ParagraphDes>{_t('5AVCqMnZKyMRrNQhNeVNo9')}</ParagraphDes>
          <ListWrapper>
            {security.map((item, index) => {
              return <DotListItem num={index + 1} key={item.key} description={item.description} />;
            })}
          </ListWrapper>
        </section>
      </ElementWrapper>
      <ElementWrapper name={anchors.reading.key}>
        <section>
          <Title>{anchors.reading.title}</Title>
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
