/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { _t, _tHTML, addLangToPath } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
import step1 from 'static/bitcoin-halving/step1.svg';
import step2 from 'static/bitcoin-halving/step2.svg';
import step3 from 'static/bitcoin-halving/step3.svg';
import { Wrapper, StepItem, Image, TitleBox, Num, Title, Des, Content } from './index.style';

const { KUCOIN_HOST } = siteConfig;

export default () => {
  return (
    <Wrapper>
      <StepItem>
        <Image src={step1} />
        <Content>
          <TitleBox>
            <Num>1</Num>
            <Title>{_t('2ScchQjtpCEBWjpqu63Vvs')}</Title>
          </TitleBox>
          <Des>
            {_tHTML('ve7Dwa8twxptG8g6vUFFX2', {
              url: addLangToPath(`${KUCOIN_HOST}/ucenter/signup`),
            })}
          </Des>
        </Content>
      </StepItem>
      <StepItem>
        <Image src={step2} />
        <Content>
          <TitleBox>
            <Num>2</Num>
            <Title>{_t('nFELv5HPj3ka8aLChPFYwU')}</Title>
          </TitleBox>
          <Des>
            {_tHTML('4Nzy6yKhzb3GwWxHaAPJgt', {
              url: addLangToPath(`${KUCOIN_HOST}/support/900005745406`),
            })}
          </Des>
        </Content>
      </StepItem>
      <StepItem>
        <Image src={step3} />
        <Content>
          <TitleBox>
            <Num>3</Num>
            <Title>{_t('2EQMBy4xmMTWwKuekGiTkS')}</Title>
          </TitleBox>
          <Des>
            {_tHTML('rNSSNvTekxPfCZsdjAXtWy', {
              url: addLangToPath(`${KUCOIN_HOST}/support/900007079063`),
            })}
          </Des>
        </Content>
      </StepItem>
    </Wrapper>
  );
};
