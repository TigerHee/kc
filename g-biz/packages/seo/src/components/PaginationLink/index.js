/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';

// firstPage 首页和其他翻页界面url不一致。
const PaginationLink = (props = {}) => {
  const { baseUrl, pagination, firstPage } = props;
  const [links, setLinks] = useState([]);

  const getPreLink = useCallback(
    (currentPage) => {
      if (currentPage - 1 === 1 && firstPage) {
        return { rel: 'prev', href: firstPage };
      }
      return { rel: 'prev', href: `${baseUrl}/${currentPage - 1}` };
    },
    [firstPage, baseUrl],
  );

  useEffect(() => {
    if (!pagination || !baseUrl) {
      return;
    }
    const { page, pageSize, count } = pagination;
    const currentPage = Number(page);
    const isLastPage = Math.ceil(count / pageSize) === currentPage;
    if (count <= pageSize) {
      setLinks([]);
      return;
    }
    let links = [];
    if (currentPage === 1) {
      links = [{ rel: 'next', href: `${baseUrl}/2` }];
    } else if (isLastPage) {
      const pre = getPreLink(currentPage);
      links = [pre];
    } else {
      links.push({ rel: 'next', href: `${baseUrl}/${currentPage + 1}` });
      const prev = getPreLink(currentPage);
      links.push(prev);
    }
    setLinks(links);
  }, [pagination, baseUrl, getPreLink]);

  if (!pagination || !baseUrl) {
    return;
  }

  // eslint-disable-next-line consistent-return
  return (
    <HelmetProvider>
      <Helmet>
        {links.map((item) => {
          return <link rel={item.rel} href={item.href} key={item.rel} />;
        })}
      </Helmet>
    </HelmetProvider>
  );
};

PaginationLink.propTypes = {
  pagination: PropTypes.exact({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
  }),
  baseUrl: PropTypes.string.isRequired,
};

PaginationLink.defaultProps = {
  pagination: null,
};

export default PaginationLink;
