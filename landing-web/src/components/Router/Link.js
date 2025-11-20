/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import Link from 'umi/link';
import { addLangToPath } from 'utils/lang';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { WITHOUT_QUERY_PARAM } from 'config';


// const formatUtmAndRcodeUrl = queryPersistence.formatUrlWithStore;


const WLink = ({ to, children, ...restProps }) => {
  const goto = queryPersistence.formatUrlWithStore(to, WITHOUT_QUERY_PARAM);
  // 外链
  if (typeof goto === 'string' && goto.indexOf('http') === 0) {
    const { onClick, ...rest } = restProps;

    let clickHandler = undefined;
    if (typeof onClick === 'function') {
      clickHandler = (e) => {
        e.preventDefault();
        onClick(e);
      };
    }

    return (
      <a
        href={addLangToPath(goto)}
        target="_blank"
        rel="noreferrer"
        {...restProps}
        onClick={clickHandler}
      >
      {children}
      </a>
    );
  }

  return (
    <Link
      to={goto}
      {...restProps}
    >
      {children}
    </Link>
  );
};

export default WLink;
