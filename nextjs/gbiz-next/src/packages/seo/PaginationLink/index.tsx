/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import SSRHelmet from '../SSRHelmet';

interface Pagination {
  page: number;
  pageSize: number;
  count: number;
}

interface PaginationLinkProps {
  pagination?: Pagination | null;
  baseUrl: string;
  firstPage?: string;
  ssr?: boolean;
}

const PaginationLink: React.FC<PaginationLinkProps> = ({ pagination, baseUrl, firstPage, ssr = true }) => {
  const [links, setLinks] = useState<{ rel: string; href: string }[]>([]);

  const getPreLink = useCallback(
    (currentPage: number) => {
      if (currentPage - 1 === 1 && firstPage) {
        return { rel: 'prev', href: firstPage };
      }
      return { rel: 'prev', href: `${baseUrl}/${currentPage - 1}` };
    },
    [firstPage, baseUrl]
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

    let newLinks: { rel: string; href: string }[] = [];

    if (currentPage === 1) {
      newLinks = [{ rel: 'next', href: `${baseUrl}/2` }];
    } else if (isLastPage) {
      const prev = getPreLink(currentPage);
      newLinks = [prev];
    } else {
      const next = { rel: 'next', href: `${baseUrl}/${currentPage + 1}` };
      const prev = getPreLink(currentPage);
      newLinks = [next, prev];
    }

    setLinks(newLinks);
  }, [pagination, baseUrl, getPreLink]);

  if (!pagination || !baseUrl) {
    return null;
  }

  return (
    <SSRHelmet ssr={ssr}>
      {links.map(item => (
        <link rel={item.rel} href={item.href} key={item.rel} />
      ))}
    </SSRHelmet>
  );
};

export default PaginationLink;
