/**
 * Owner: solar.xia@kupotech.com
 */
import { Accordion } from '@kux/mui';
import FAQJson from 'components/Seo/FAQJson';
import { map } from 'lodash';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { _t, _tHTML } from 'tools/i18n';
import { getTextFromHtml } from 'utils/seoTools';
import { FAQContainer, StyledFAQ } from '../styledComponents';
import { skip2Faq } from '../util';
import { MoreButton } from './components/MoreButton';

const { AccordionPanel } = Accordion;

const FAQ = forwardRef((props, ref) => {
  const faqRef = useRef(null);

  useImperativeHandle(ref, () => faqRef.current);

  const faqData = [
    {
      question: _t('i5K31SaR3iA5ovEPHJUE8U'),
      answer: _tHTML('kf94PZzJmWixE68UsnjVeQ'),
    },
    {
      question: _t('d2KVmeWV5E2ZsSVFLFcKPT'),
      answer: _t('98f56b36bb6b4000af66'),
    },
    {
      question: _t('2e172Mu5QQSYKdaU4ubKJU'),
      answer: _t('aEN86Ds4mkyPTWUyufuLGp'),
    },
    {
      question: _t('rjGhnhp2YcCdRNLouE22v6'),
      answer: _t('thvHhWJktNruRExcvV84E9'),
    },
    {
      question: _t('bQxowNmdbxR21gFkaoiRRE'),
      answer: _tHTML('hDzRLFgtzZJbmxUjyvStwJ'),
    },
    {
      question: _t('mwWNimQetv9osMoWcp76wk'),
      answer: _tHTML('cXk8Hhar9eEoehaCAmr8rf'),
    },
    {
      question: _t('tY2PABAUWYM1x2wqzgSdL5'),
      answer: _tHTML('x9p83u5uiwMKdeeRb4nmbC'),
    },
  ];

  const transformText = (item) => {
    return item?.props?.dangerouslySetInnerHTML
      ? getTextFromHtml(item?.props?.dangerouslySetInnerHTML?.__html)
      : item;
  };

  const faqSeoData = map(faqData, ({ question, answer }) => ({
    question: transformText(question),
    answer: transformText(answer),
  }));

  return (
    <StyledFAQ ref={faqRef} data-inspector="inspector_premarket_faq">
      <FAQJson faq={faqSeoData} />
      <FAQContainer>
        <div className="header">
          <h2>FAQ</h2>
          <MoreButton className="more" onClick={skip2Faq} />
        </div>
        <Accordion dispersion size="small">
          {map(faqData, ({ question, answer }) => {
            return (
              <AccordionPanel key={question} header={question}>
                {answer}
              </AccordionPanel>
            );
          })}
        </Accordion>
      </FAQContainer>
    </StyledFAQ>
  );
});
export default FAQ;
