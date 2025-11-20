/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import { _tHTML, addLangToPath } from 'tools/i18n';
import { Tooltip } from '@kufox/mui';
import siteCfg from 'utils/siteConfig';
import style from './style.less';

const vfn = () => {};

const StTag = ({ showTip = true, className, ...rest }) => {
  const moreLink = addLangToPath(`${siteCfg.KUCOIN_HOST}/support/360003256193`);

  const handClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!showTip) {
    return <sup className={`kucoinTag tagHas ${style.stTag} ${className || ''}`}>*st</sup>;
  }

  return (
    <Tooltip title={_tHTML('market.st.tips', { moreLink })} onClick={handClick} {...rest}>
      <sup className={`kucoinTag tagHas ${style.stTag} ${className || ''}`}>*st</sup>
    </Tooltip>
  );
};

export default StTag;
