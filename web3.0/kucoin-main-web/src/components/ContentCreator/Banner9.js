/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { px2rem } from '@kufox/mui';
import { Box } from '@kufox/mui';
import FAQItem from './FAQItem';
import { TERMS_CONDITIONS } from './config';
import { _t } from 'tools/i18n';
import { styled } from '@kufox/mui';

const Wrapper = styled(Box)`
  margin: 0 auto;
  width: 83.3%;
  max-width: ${px2rem(1200)};
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 93.75%;
    padding-bottom: ${px2rem(60)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 93.6%;
    padding-bottom: ${px2rem(40)};
  }
`;

const Title = styled.h2`
  margin-bottom: ${px2rem(26)};
  font-weight: normal;
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  color: #00142a;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: ${px2rem(21)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-bottom: ${px2rem(16)};
    font-size: ${px2rem(24)};
    line-height: ${px2rem(38)};
  }
`;

const Banner9 = () => {
  return (
    <Wrapper>
      <Title>{_t('creator.ninth.title')}</Title>
      {map(TERMS_CONDITIONS, ({ question, answer }, index) => (
        <FAQItem key={index} question={question} answer={answer} />
      ))}
    </Wrapper>
  );
};

export default Banner9;
