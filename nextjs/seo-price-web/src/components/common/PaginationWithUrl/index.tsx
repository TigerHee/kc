/**
 * Owner: ella@kupotech.com
 */
import clxs from 'clsx';
import { LeftOutlined, RightOutlined } from '@kux/icons';
import { Pagination } from '@kux/mui-next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { addLangToPath } from '@/tools/i18n';
import styles from './styles.module.scss';
import Link from '@/components/common/Router/link';
import { IS_CLIENT } from '@/config/env';

export type PaginationWidthUrlProps = {
  pagination: { current?: number; pageSize?: number; total?: number; };
  basePath?: string;
  firstPage: string;
  shouldNotJump?: boolean;
}

type PaginationLink = {
  rel: string;
  href: string;
}

// basePath使用前端跳转
// firstPage 首页路由和其他分页路由不统一
const PaginationWidthUrl = ({ pagination = {}, shouldNotJump = false, basePath, firstPage, ...other }: PaginationWidthUrlProps) => {
  const { total } = pagination;

  const getUrl = useCallback(
    (page: number) => {
      if (firstPage && page === 1) {
        return firstPage;
      }
      return `${basePath}/page/${page}`;
    },
    [basePath, firstPage],
  );

  const handleUrl = useCallback((url: string, page: number) => {
    if (IS_CLIENT && typeof window !== 'undefined') {
      if (shouldNotJump) {
        const url = new URL(`${window.location.protocol}//${window.location.host}/price/page/${page}`);

        // 更新地址栏，不会刷新页面
        window.history.replaceState({}, "", url);
        // 触发自定义事件
        window.dispatchEvent(new Event("pagechange"));
        return;
      }

      window.location.href = url;
    }
  }, [shouldNotJump]);

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
              dontGoWithHref={shouldNotJump}
              data-inspector="pre-btn"
              href={pageUrl}
              onClick={(e) => {
                if (shouldNotJump) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUrl(pageUrl, page);
                }
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
              dontGoWithHref={shouldNotJump}
              data-inspector="page-btn"
              to={pageUrl}
              onClick={(e) => {
                if (shouldNotJump) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUrl(pageUrl, page);
                }
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
              dontGoWithHref={shouldNotJump}
              data-inspector="next-btn"
              to={pageUrl}
              onClick={(e) => {
                if (shouldNotJump) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUrl(pageUrl, page);
                }
              }}
              className={clxs(styles.arrow, { [styles.disabledArrow]: disabled })}
            >
              <RightOutlined size="16" />
            </Link>
          );
      }
    },
    [getUrl, handleUrl, shouldNotJump],
  );

  const paginationLinks: PaginationLink[] = useMemo(() => {
    const { current = 1, pageSize = 10, total = 0 } = pagination;
    const isLastPage = Math.ceil(total / pageSize) === current;

    if (total <= pageSize) {
      return [];
    }

    let links: PaginationLink[] = [];

    if (current === 1) {
      links = [{ rel: 'next', href: addLangToPath(`${getUrl(2)}`) }];
    } else if (isLastPage) {
      links = [{ rel: 'prev', href: addLangToPath(`${getUrl(current - 1)}`) }];
    } else {
      links.push({ rel: 'next', href: addLangToPath(`${getUrl(current + 1)}`) });
      links.push({ rel: 'prev', href: addLangToPath(`${getUrl(current - 1)}`) });
    }
    
    return links;
  }, [getUrl, pagination])

  if (!total) {
    return null;
  }

  return (
    <React.Fragment>
      <Helmet>
        {paginationLinks.map((item) => {
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
