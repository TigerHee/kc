/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import SoldOutTag from 'components/common/SoldOutTag';
import FiatTag from 'components/common/FiatTag';

const InlineCoin = ({
  coin,
  currencyName,

  type,
  iconUrl,
  name,
  size,
  maskIcon,
  className,
  onClick,
  // isAssets,
  currencyStatus,
  isDigital,
  hideName = false,
  fontClassName = 'font-size-12',
  nameFontWeight = 500,
  isMarket = false,
  rv,
  nameProps = {},
}) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {iconUrl && isMarket && rv && rv.lg ? (
        maskIcon ? (
          <div
            style={{
              width: maskIcon,
              height: maskIcon,
              borderRadius: maskIcon,
              background: '#E9EDEF',
              float: 'left',
              textAlign: 'center',
              verticalAlign: 'middle',
              display: 'inline-block',
              marginRight: '8px',
            }}
          >
            <img
              src={iconUrl}
              alt={type}
              style={{
                width: size,
                height: size,
                marginTop: `${(size - maskIcon) / 4}px`,
              }}
            />
          </div>
        ) : (
          <img
            src={iconUrl}
            alt={type}
            style={{
              width: size,
              height: size,
              float: 'left',
              marginRight: 4,
            }}
          />
        )
      ) : null}
      <span {...nameProps}>
        <span className={fontClassName} style={{ fontWeight: 500 }}>
          {coin === '__ALL__' ? 'ALL' : currencyName}
          {!isDigital && <FiatTag />}
        </span>
        {!hideName && (
          <span className="color-gray" style={{ fontSize: 13, fontWeight: nameFontWeight }}>
            {name === '__ALL__' ? 'ALL' : name}
          </span>
        )}
      </span>

      {currencyStatus === 1 && <SoldOutTag />}
    </div>
  );
};

InlineCoin.defaultProps = {
  size: 30,
};

export default InlineCoin;
