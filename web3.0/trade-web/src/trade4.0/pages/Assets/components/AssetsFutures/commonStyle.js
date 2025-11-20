/**
 * Owner: garuda@kupotech.com
 * 合约资产组件公用样式
 */

import React, { useMemo, memo } from 'react';
import { useSelector } from 'react-redux';

import Mask, { Placeholder } from '@/components/Mask';
import PrettyCurrency from '@/components/PrettyCurrency';
import { styled } from '@/style/emotion';


export const AssetsTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
`;

export const AssetsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .assets-item {
    margin-top: 8px;
  }
`;

export const AssetsBox = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => (props.isMd ? '&' : 'false')} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .assets-item {
      flex-wrap: wrap;
      min-width: 48%;
      max-width: 48%;
    }
  }
  &.tip-box {
    color: #fff;

    .tip-title,
    .assets-mask {
      color: rgba(243, 243, 243, 0.4);
    }
    .assets-mask,
    .pretty-currency {
      font-weight: 400;
      color: #fff;
    }
    .assets-item {
      &:not(:last-of-type) {
        margin-bottom: 4px;
      }
    }
  }
`;

export const AssetsItem = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  min-width: 240px;
  color: ${(props) => props.theme.colors.text40};
  .underline {
    text-decoration: underline dashed ${(props) => props.theme.colors.text20};
    cursor: help;
  }
  .item-label {
    font-size: 12px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text60};
  }
  .pretty-currency {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }
`;

const PrettyCurrencyColor = styled(PrettyCurrency)`
  font-size: 12px;
  line-height: 1.3;
  color: ${(props) => {
    return !props.showColor || !props.value
      ? props.theme.colors.text
      : props.value >= 0
      ? `${props.theme.colors.primary} !important`
      : `${props.theme.colors.secondary} !important`;
  }};
`;

export const PrettyValue = memo(({ children, ...other }) => {
  const showAssets = useSelector((state) => state.setting.showAssets);
  const isLogin = useSelector((state) => state.user.isLogin);
  if (!showAssets) return <Mask className="assets-mask" />;
  if (!isLogin) return <Placeholder className="assets-placeholder" />;
  return children || <PrettyCurrencyColor currency="--" placeholder="--" {...other} />;
});
