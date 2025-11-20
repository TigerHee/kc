/**
 * Owner: jessie@kupotech.com
 */
import { ICTradeAddOutlined, ICTradeMinusOutlined } from '@kux/icons';
import { Accordion, Divider } from '@kux/mui';
import FAQJson from 'components/Seo/FAQJson';
import { map } from 'lodash';
import { useSelector } from 'src/hooks/useSelector';
import QuestionIcon from 'static/votehub/question.svg';
import { _t } from 'tools/i18n';
import { getTextFromHtml } from 'utils/seoTools';
import { FAQContainer, StyledFAQ } from '../styledComponents';
import Title from './components/Title';

const { AccordionPanel } = Accordion;

const FAQ = () => {
  const voteLimitNum = useSelector((state) => state.votehub.voteLimitNum);
  const faqData = [
    {
      question: _t('c2SVPM9F3B7BWjqebcQHXK'),
      answer: _t('vKFNbRWzrrghHGXcmPGZ8w'),
    },
    {
      question: _t('aUsy9BryvW3Zr7Df1mm1WK'),
      answer: _t('rFQuHUgR3j3T4mbqA5c998'),
    },
    {
      question: _t('1nFYVsU4Sq9HAPZRmvHaLz'),
      answer: _t('mZSPyTKQ9hVkhSTfQPK6p9', { num: voteLimitNum || '0' }),
    },
    {
      question: _t('5j98qHULzUgG59t2V91qBm'),
      answer: _t('2LxthT6ugrrBfYTNQPmMFF'),
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
    <StyledFAQ data-inspector="inspector_votehub_faq">
      <FAQJson faq={faqSeoData} />
      <FAQContainer>
        <Title title="FAQ" coin={QuestionIcon} />
        <Accordion
          accordion
          bordered={false}
          expandIcon={(active) => (active ? <ICTradeMinusOutlined /> : <ICTradeAddOutlined />)}
        >
          {map(faqData, ({ question, answer }, index) => {
            return (
              <AccordionPanel header={question} key={`qustion_${index}`}>
                <Divider />
                {answer}
              </AccordionPanel>
            );
          })}
        </Accordion>
      </FAQContainer>
    </StyledFAQ>
  );
};

export default FAQ;
