/**
 * Owner: iron@kupotech.com
 */
import { xssOptions } from 'packages/seo/config';
import React, { useMemo } from 'react';
import { filterXSS } from 'xss';
import SSRHelmet from '../SSRHelmet';

// 定义 FAQ item 类型
interface FAQItem {
  question: string;
  answer: string;
}

// 定义 props 类型
interface FAQJsonProps {
  faq: FAQItem[];
  ssr?: boolean;
}

const FAQJson: React.FC<FAQJsonProps> = ({ faq, ssr = true }) => {
  const xssFilteredFAQJson = useMemo(() => {
    if (!faq || faq.length === 0) return null;

    const filteredData = faq.map(item => ({
      '@type': 'Question',
      // 保证传入的是纯文本
      name: filterXSS(item.question, xssOptions),
      acceptedAnswer: {
        '@type': 'Answer',
        // 保证传入的是纯文本
        text: filterXSS(item.answer, xssOptions),
      },
    }));

    const faqJsonData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: filteredData,
    };

    try {
      const filteredJsonString = JSON.stringify(faqJsonData);
      return filteredJsonString;
    } catch (error) {
      console.error('Failed to stringify FAQ JSON-LD', error);
      return null;
    }
  }, [faq]);

  if (!xssFilteredFAQJson) return null;

  return (
    <SSRHelmet ssr={ssr}>
      {ssr ? (
        <script
          type="application/ld+json"
          data-inspector="seo-faqjson"
          dangerouslySetInnerHTML={{
            // xssFilteredFAQJson 已经被xss过滤过，确保安全
            __html: xssFilteredFAQJson,
          }}
        />
      ) : (
        <>
          <script type="application/ld+json" data-inspector="seo-faqjson">
            {xssFilteredFAQJson}
          </script>
        </>
      )}
    </SSRHelmet>
  );
};

export default FAQJson;
