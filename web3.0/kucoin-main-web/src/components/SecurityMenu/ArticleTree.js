/**
 * Owner: brick.fan@kupotech.com
 */
import { styled } from '@kux/mui';
import { ICArrowDownOutlined, ICArrowUpOutlined } from '@kux/icons';
import React, { useState } from 'react';
import history from '@kucoin-base/history';
import { _t } from 'tools/i18n';
import { articles } from './config';
import clsx from 'classnames';

const Wrapper = styled.div``;
const ArticleTree = ({ onClose }) => {
  const [openIds, setOpenIds] = useState([]);

  const onClick = (id) => {
    setOpenIds(
      openIds.includes(id) ? openIds.filter((item) => !item.includes(id)) : [...openIds, id],
    );
  };

  const onClickItem = (item) => {
    onClose?.();
    history.push(item.path);
  };

  // 递归生成树
  const renderTree = (data, level) => {
    return data.map((item) => {
      const hasChildren = item.type === 'category' && item.children.length > 0;
      const isOpen = openIds.includes(item.id);

      return (
        <li key={item.id}>
          <Wrapper
            onClick={() => {
              if (hasChildren) {
                onClick(item.id);
              } else {
                onClickItem(item);
              }
            }}
            className={clsx({
              'article-title': !hasChildren,
              'parent-title': hasChildren,
            })}
          >
            {_t(item.title)}
            {hasChildren && item.type === 'category' && (
              <span>{isOpen ? <ICArrowUpOutlined /> : <ICArrowDownOutlined />}</span>
            )}
          </Wrapper>
          {item.type === 'category' && isOpen && (
            <ul className={`ul-${level + 1}`}>{renderTree(item.children, level + 1)}</ul>
          )}
        </li>
      );
    });
  };

  return <ul className="ul-1">{renderTree(articles, 1)}</ul>;
};

export default ArticleTree;
