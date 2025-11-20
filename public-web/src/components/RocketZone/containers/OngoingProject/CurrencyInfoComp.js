/**
 * Owner: jessie@kupotech.com
 */
import { memo, useMemo } from 'react';
import FireIcon from 'static/rocket_zone/fire.gif';
import { _t } from 'tools/i18n';
import { CurrencyInfoWrapper } from './styledComponents';

const CurrencyInfoComp = memo(({ fire, worldPremiere, shortName, fullName }) => {
  const tagInfo = useMemo(() => {
    if (!fire && !worldPremiere) return;

    return (
      <div className="tag">
        {fire && <img src={FireIcon} alt="fire" className="hot" />}
        {worldPremiere && (
          <div className="label">
            <span>{_t('aobTYeFRCrghvyU9ELVMp7')}</span>
          </div>
        )}
      </div>
    );
  }, [fire, worldPremiere]);

  return (
    <CurrencyInfoWrapper>
      <div className="nameWrapper">
        <div className="name">{shortName}</div>
        <div className="fullName">{fullName}</div>
      </div>
      {tagInfo}
    </CurrencyInfoWrapper>
  );
});

export default CurrencyInfoComp;
