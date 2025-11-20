/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICTradeAddOutlined, ICTradeMinusOutlined } from '@kux/icons';
import { Accordion, Divider } from '@kux/mui';
import FAQJson from 'components/Seo/FAQJson';
import { map } from 'lodash';
import { useEffect, useRef } from 'react';
import siteCfg from 'src/utils/siteConfig';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { push } from 'utils/router';
import { getTextFromHtml } from 'utils/seoTools';
import { FAQContainer, StyledFAQ } from './styledComponents';

const { AccordionPanel } = Accordion;
const { KUCOIN_HOST } = siteCfg;

const FAQ = () => {
  const isInApp = JsBridge.isApp();
  const myRef = useRef();

  const handleClick = (event) => {
    event.preventDefault();
    if (isInApp) {
      const tragetUrl = KUCOIN_HOST + addLangToPath('/listing');
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${encodeURIComponent(tragetUrl)}`,
        },
      });
    } else {
      push('/listing');
    }
  };

  useEffect(() => {
    const node = myRef.current;

    if (node instanceof HTMLElement) {
      const a = node.querySelector('#qustion a');

      if (a) {
        a.addEventListener('click', handleClick);
      }
    }

    return () => {
      const node = myRef.current;

      if (node instanceof HTMLElement) {
        const a = node.querySelector('#qustion a');
        if (a) {
          a.removeEventListener('click', handleClick);
        }
      }
    };
  }, []);

  const faqData = [
    {
      question: _t('wpHQQsVnJTk2xBwAVK7YHP'),
      answer: _tHTML('aEot1J2QEZpeW3hMyiYDbL', { href: addLangToPath('/listing/apply') }),
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
    <StyledFAQ data-inspector="inspector_gemspace_faq">
      <FAQJson faq={faqSeoData} />
      <FAQContainer>
        <h2 className="title">{_t('2tavmdYbkww1RBa8p8Kak7')}</h2>
        <Accordion
          accordion
          bordered={false}
          expandIcon={(active) => (active ? <ICTradeMinusOutlined /> : <ICTradeAddOutlined />)}
        >
          {map(faqData, ({ question, answer }, index) => {
            return (
              <AccordionPanel header={question} key={`qustion_${index}`}>
                <Divider />
                <div id="qustion" ref={myRef}>
                  {answer}
                </div>
              </AccordionPanel>
            );
          })}
        </Accordion>
      </FAQContainer>
    </StyledFAQ>
  );
};

export default FAQ;
