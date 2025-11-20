/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import { filterXSS } from 'xss';
import { xssOptions } from 'packages/seo/config';
import SSRHelmet from '../SSRHelmet';

interface Author {
  name: string;
  url?: string;
}

interface Article {
  images?: string[];
  datePublished?: string;
  dateModified?: string;
  author?: Author[];
  title: string;
}

interface ArticleJsonProps {
  article: Article;
  type: string;
  ssr?: boolean;
}

const ArticleJson: React.FC<ArticleJsonProps> = ({ article, type, ssr = true }) => {
  const xssFilteredJson = useMemo(() => {
    if (!article) return null;

    const { images, datePublished, dateModified, author, title } = article;

    const articleData: any = {
      '@context': 'https://schema.org',
      '@type': filterXSS(type, xssOptions),
      headline: filterXSS(title, xssOptions),
    };

    if (images) {
      articleData.image = Array.isArray(images)
        ? images.map(img => {
            return filterXSS(img || '', xssOptions);
          })
        : [];
    }
    if (datePublished) {
      articleData.datePublished = filterXSS(datePublished);
    }
    if (dateModified) {
      articleData.dateModified = filterXSS(dateModified, xssOptions);
    }
    if (author) {
      articleData.author = author.map(item => ({
        '@type': 'Person',
        name: filterXSS(item.name, xssOptions),
        url: filterXSS(item.url || '', xssOptions),
      }));
    }

    try {
      return JSON.stringify(articleData);
    } catch (error) {
      console.error('Failed to stringify article JSON-LD', error);
      return null;
    }
  }, [article, type]);

  if (!xssFilteredJson) return null;

  return (
    <SSRHelmet ssr={ssr}>
      {ssr ? (
        <script
          type="application/ld+json"
          data-inspector="seo-artilejson"
          dangerouslySetInnerHTML={{
            // xssFilteredFAQJson 已经被xss过滤过，确保安全
            __html: xssFilteredJson,
          }}
        />
      ) : (
        <script type="application/ld+json" data-inspector="seo-artilejson">
          {xssFilteredJson}
        </script>
      )}
    </SSRHelmet>
  );
};

export default ArticleJson;
