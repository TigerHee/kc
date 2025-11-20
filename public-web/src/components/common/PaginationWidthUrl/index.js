/**
 * Owner: ella@kupotech.com
 */
import history from '@kucoin-base/history';
import { LeftOutlined, RightOutlined } from '@kufox/icons';
import { Pagination } from '@kufox/mui';
import clxs from 'classnames';
import { Link } from 'components/Router';
import qs from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { addLangToPath } from 'tools/i18n';
import styles from './style.less';

// basePath使用前端跳转
// firstPage 首页路由和其他分页路由不统一
const PaginationWidthUrl = ({ pagination = {}, basePath = '', firstPage, ...other }) => {
  const { total } = pagination;
  const [links, setLinks] = useState([]);

  const getUrl = useCallback(
    (page) => {
      if (firstPage && page === 1) {
        return firstPage;
      }
      const url = new URL(basePath || window.location.href, window.location.origin);
      const query = qs.parse(url.search, { decode: false }) || {};
      query.page = page;
      const search = qs.stringify(query);
      url.search = search;
      if (basePath) {
        return `${basePath}?${search}`;
      }
      return url.href;
    },
    [basePath, firstPage],
  );

  const handleUrl = useCallback((url) => {
    history.push(url);
  }, []);

  const renderPageItem = useCallback(
    (item) => {
      if (!item) {
        return '';
      }
      const { disabled, page, selected, type } = item;
      const pageUrl = getUrl(page);
      switch (type) {
        case 'previous':
          if (disabled) {
            return (
              <div className={styles.disabledArrow}>
                <LeftOutlined size="16" />
              </div>
            );
          }
          return (
            <Link
              to={pageUrl}
              redirect={!basePath}
              onClick={() => {
                handleUrl(pageUrl);
              }}
              className={clxs(styles.arrow, { [styles.disabledArrow]: disabled })}
            >
              <LeftOutlined size="16" />
            </Link>
          );
        case 'end-ellipsis':
          return <div className={styles.endEllipsis}>...</div>;
        case 'page':
          return (
            <Link
              disabled={disabled}
              to={pageUrl}
              redirect={!basePath}
              onClick={() => {
                handleUrl(pageUrl);
              }}
              className={clxs(styles.pageItem, { [styles.linkSelect]: selected })}
            >
              {page}
            </Link>
          );
        case 'next':
          if (disabled) {
            return (
              <div className={styles.disabledArrow}>
                <RightOutlined size="16" />
              </div>
            );
          }
          return (
            <Link
              to={pageUrl}
              redirect={!basePath}
              onClick={() => {
                handleUrl(pageUrl);
              }}
              className={clxs(styles.arrow, { [styles.disabledArrow]: disabled })}
            >
              <RightOutlined size="16" />
            </Link>
          );
      }
    },
    [getUrl, basePath, handleUrl],
  );

  useEffect(() => {
    const { current, pageSize, total } = pagination;
    const isLastPage = Math.ceil(total / pageSize) === current;
    if (total <= pageSize) {
      setLinks([]);
      return null;
    }
    let links = [];
    const origin = window.location.origin;
    if (current === 1) {
      links = [{ rel: 'next', href: addLangToPath(`${origin}${getUrl(2)}`) }];
    } else if (isLastPage) {
      links = [{ rel: 'prev', href: addLangToPath(`${origin}${getUrl(current - 1)}`) }];
    } else {
      links.push({ rel: 'next', href: addLangToPath(`${origin}${getUrl(current + 1)}`) });
      links.push({ rel: 'prev', href: addLangToPath(`${origin}${getUrl(current - 1)}`) });
    }
    setLinks(links);
  }, [pagination, getUrl]);

  if (!total) {
    return null;
  }

  return (
    <React.Fragment>
      <Helmet>
        {links.map((item) => {
          return <link rel={item.rel} href={item.href} key={item.rel} />;
        })}
      </Helmet>
      <Pagination
        {...pagination}
        renderItem={renderPageItem}
        className={styles.pagination}
        {...other}
      />
    </React.Fragment>
  );
};

export default PaginationWidthUrl;
