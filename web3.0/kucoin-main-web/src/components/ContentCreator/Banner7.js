/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { px2rem } from '@kufox/mui';
import { Box } from '@kufox/mui';
import FAQItem from './FAQItem';
import { FAQS } from './config';
import { _t } from 'tools/i18n';
import { styled } from '@kufox/mui';
import FAQJson from 'components/Seo/FAQJson';

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

const Faqs = FAQS.map((item) => {
  return {
    question: item.question,
    answer: item.answerText || item.answer,
  };
});

const Banner7 = () => {
  return (
    <Wrapper>
      {/* 如果需要去掉常见问题，注意去掉巡检用例 */}
      <FAQJson faq={Faqs} />
      <Title>{_t('creator.seventh.title')}</Title>
      {map(FAQS, ({ question, answer }, index) => (
        <FAQItem key={index} question={question} answer={answer} />
      ))}
    </Wrapper>
  );
};

export default Banner7;
