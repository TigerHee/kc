/*
 * @Date: 2024-05-27 15:58:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import { useLocale } from '@kucoin-base/i18n';
import classnames from 'classnames';
import React from 'react';
import CoinIcon from 'src/components/common/CoinIcon';
import rocketBg from 'static/slothub/rocket-icon.svg';
import { useStore } from '../../store';

const IconWrap = styled.div`
  position: relative;
`;

const RocketBg = styled.img`
  width: 191px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 114px;
  }
`;

const SymbolIcon = styled(CoinIcon)`
  position: absolute;
  width: 76px;
  height: 76px;
  left: ${({ isRTL }) => (isRTL ? 'unset' : '34px')};
  right: ${({ isRTL }) => (!isRTL ? 'unset' : '34px')};
  top: 31px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 18px;
    right: ${({ isRTL }) => (!isRTL ? '47px' : 'unset')};
    left: ${({ isRTL }) => (isRTL ? '47px' : 'unset')};
    width: 48px;
    height: 48px;
  }
`;

const RightCoinIcon = (props) => {
  const { className } = props;
  const { state } = useStore();
  const { isRTL } = useLocale();

  const { currency } = state.projectDetail || {};
  return (
    <IconWrap className={classnames(className, 'horizontal-flip-in-arabic')}>
      <RocketBg src={rocketBg} alt="background image in banner" />

      <SymbolIcon hiddenLoading coin={currency} isRTL={isRTL} />
    </IconWrap>
  );
};

export default React.memo(RightCoinIcon);
