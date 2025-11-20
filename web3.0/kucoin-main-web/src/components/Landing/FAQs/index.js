/**
 * Owner: ella.wang@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import FAQJson from 'components/Seo/FAQJson';
import { getTextFromHtml } from 'utils/seoTools';
import AccordionDom from './components/Accordion';
import { Wrapper } from './index.style';

const getFaqData = (faqs = []) => {
  const data = faqs.map((item) => {
    let answer = '';
    item.description.forEach((des) => {
      const text = des?.props?.dangerouslySetInnerHTML
        ? getTextFromHtml(des?.props?.dangerouslySetInnerHTML?.__html)
        : des;
      answer += text;
    });
    return {
      question: item.title,
      answer: answer,
    };
  });
  return data;
};

export default ({ faqs, bgTheme }) => {
  const [faqjson, setFaqjson] = useState(getFaqData(faqs));

  useEffect(() => {
    setFaqjson(getFaqData(faqs));
  }, [faqs]);

  return (
    <Wrapper>
      <FAQJson faq={faqjson} />
      {faqs.map((item) => {
        return (
          <li key={item.title}>
            <AccordionDom
              key={item.title}
              title={item.title}
              description={item.description}
              bgTheme={bgTheme}
            />
          </li>
        );
      })}
    </Wrapper>
  );
};
