/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

const FAQJson = (props = {}) => {
  const { faq } = props;
  const [faqJson, setFaqJson] = useState();

  useEffect(() => {
    if (!faq) {
      return;
    }
    const data = faq.map((item) => {
      return {
        '@type': 'Question',
        name: item?.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item?.answer,
        },
      };
    });
    const fqaJsonData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data,
    };
    try {
      const fqaJson = JSON.stringify(fqaJsonData);
      setFaqJson(fqaJson);
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  }, [faq]);

  if (!faqJson) {
    return null;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <script type="application/ld+json" data-inspector="seo-faqjson">
          {faqJson}
        </script>
      </Helmet>
    </HelmetProvider>
  );
};

FAQJson.propTypes = {
  faq: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string,
      answer: PropTypes.string,
    }),
  ).isRequired,
};

export default FAQJson;
