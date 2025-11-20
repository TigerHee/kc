/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

const ArticleJson = (props = {}) => {
  const { article, type } = props;
  const [articleJson, setArticleJson] = useState();

  useEffect(() => {
    if (!article) {
      return;
    }
    const { images, datePublished, dateModified, author, title } = article;
    const articleData = {
      '@context': 'https://schema.org',
      '@type': type,
      headline: title,
    };
    if (images) {
      articleData.image = images;
    }
    if (datePublished) {
      articleData.datePublished = datePublished;
    }
    if (dateModified) {
      articleData.dateModified = dateModified;
    }
    if (author) {
      articleData.author = author.map((item) => {
        return {
          '@type': 'Person',
          name: item.name,
          url: item.url,
        };
      });
    }
    try {
      const articleJson = JSON.stringify(articleData);
      setArticleJson(articleJson);
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  }, [article, type]);

  if (!articleJson) {
    return null;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <script type="application/ld+json">{articleJson}</script>
      </Helmet>
    </HelmetProvider>
  );
};

ArticleJson.propTypes = {
  article: PropTypes.exact({
    images: PropTypes.array,
    datePublished: PropTypes.string,
    dateModified: PropTypes.string,
    author: PropTypes.array,
    title: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default ArticleJson;
