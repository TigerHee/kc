/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { css, cx } from '@emotion/css';

const useStyle = () => {
  return useMemo(() => {
    return {
      root: css({
        width: '166px',
        height: '48px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        borderRadius: '4px',
        cursor: 'pointer',
        textDecoration: 'none',
      }),
      primary: css({
        background: '#24AE8F',
        color: '#fff',
      }),
      goast: css({
        background: '#fff',
        color: '#464E5B',
        border: '1px solid #6C7988',
      }),
    };
  }, []);
};

function Button(props) {
  const { children, color, target } = props;
  const classes = useStyle();
  const cls = cx(classes.root, classes[color]);
  const _target = typeof target === 'string' ? queryPersistence.formatUrlWithStore(target) : target;
  return (
    <a className={cls} target="_blank" rel="noopener noreferrer" href={_target}>
      {children}
    </a>
  );
}

export default Button;
