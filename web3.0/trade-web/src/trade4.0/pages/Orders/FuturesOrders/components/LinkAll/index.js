/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';
import { styled, fx } from '@/style/emotion';
import { Link } from 'components/Router';

const LinkAllContent = styled.div`
  ${fx.minHeight('40', 'px')}
  ${fx.padding('12px')}
  ${fx.fontSize('12')} 
  ${(props) => fx.color(props, 'text40')}
  text-align: center;
  .pad {
    padding: 2px;
  }
  > span,
  > a {
    vertical-align: middle;
  }
  > a {
    display: inline;
  }
`;

const LinkAll = ({ count, type, path }) => {
  return (
    <LinkAllContent>
      <span>{_t('trade.link.all', { count })}</span>
      <span className="pad" />
      <Link href={path} target="_blank">
        {type}
      </Link>
    </LinkAllContent>
  );
};

export default React.memo(LinkAll);
