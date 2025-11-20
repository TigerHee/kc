/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui';
import SoldOutTag from 'components/common/SoldOutTag';
import FiatTag from 'components/common/FiatTag';
import { themeColorText40 } from 'src/utils/themeSelector';

const InlineCoinWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  line-height: ${({ size }) => `${size}px`};
  .color-gray {
    color: ${themeColorText40};
  }
`;

const MaskIconWrapper = styled.div`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  background: #e9edef;
  float: left;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
  margin-right: 8px;
`;

const IconImg = styled.img`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  float: left;
  margin-right: 4px;
  border-radius: 50%;
`;

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
  nameProps = {},
}) => {
  return (
    <InlineCoinWrapper onClick={onClick} className={className} size={maskIcon || size}>
      {iconUrl ? (
        maskIcon ? (
          <MaskIconWrapper size={maskIcon}>
            <img
              src={iconUrl}
              alt={type}
              style={{
                width: size,
                height: size,
                marginTop: `${(size - maskIcon) / 4}px`,
              }}
            />
          </MaskIconWrapper>
        ) : (
          <IconImg src={iconUrl} alt={type} size={size} />
        )
      ) : null}
      <span {...nameProps}>
        <span className={fontClassName} style={{ fontWeight: 500 }}>
          {coin === '__ALL__' ? 'ALL' : currencyName}
          {!isDigital && <FiatTag />}
        </span>
        &nbsp;
        {!hideName && (
          <span className="color-gray" style={{ fontSize: 13, fontWeight: nameFontWeight }}>
            {name === '__ALL__' ? 'ALL' : name}
          </span>
        )}
      </span>

      {currencyStatus === 1 && <SoldOutTag />}
    </InlineCoinWrapper>
  );
};

InlineCoin.defaultProps = {
  size: 30,
};

export default InlineCoin;
