/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { Button } from '@kufox/mui';
import { _t } from 'tools/i18n';

/**
 * 文件下载
 * @param {{
 *  href?: string,
 *  name?: string,
 *  btnProps?: any,
 *  style?: React.CSSProperties,
 *  variant?: string,
 * }} props
 */
const DownFile = (props) => {
  const { href, children = _t('download'), btnProps, style, variant, ...others } = props;
  const conf = href
    ? {
        href,
        download: true,
        rel: 'noopener noreferrer',
        target: '_blank',
      }
    : undefined;
  return (
    <a {...others} {...conf} style={style}>
      <Button variant={variant} size="mini" {...btnProps}>
        {children}
      </Button>
    </a>
  );
};

export default memo(DownFile);
