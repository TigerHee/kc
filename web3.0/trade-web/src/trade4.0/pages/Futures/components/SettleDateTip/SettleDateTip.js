/**
 * Owner: garuda@kupotech.com
 */
import React, { useMemo } from 'react';

import { styled } from '@kux/mui/emotion';

import { moment2Intl } from 'helper';

import { _t, _tHTML } from 'utils/lang';

import { ReactComponent as SettleIcon } from '@/assets/futures/settle-date.svg';
import Text from '@/components/Text';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { symbolToText } from '@/hooks/futures/useGetSymbolText';

import { FUTURES } from '@/meta/const';
import { SETTLE_CONTRACT, SUSTAIN_CONTRACT } from '@/meta/futures';
import { useContractSettlement } from '@/pages/Futures/hooks/useContractSettlement';

const SettleWrapper = styled.div`
  display: flex;
  align-items: center;
  .icon {
    color: ${(props) => props.theme.colors.complementary};
  }
  .icon,
  &.icon:hover,
  svg:hover {
    flex: 0 0 auto;
    width: ${(props) => (props.largeIcon ? '16px' : '12px')};
    height: ${(props) => (props.largeIcon ? '16px' : '12px')};
    margin: 0 4px 0 0;
    color: ${(props) => props.theme.colors.complementary} !important;
    path {
      fill: transparent !important;
    }
  }
  .settle-text {
    color: ${(props) => props.theme.colors.complementary};
    font-weight: 400;
    font-size: 12px;
    line-height: 1.3;
  }
`;

const SettleDateTip = ({ className, symbol, showText = true, largeIcon = false }) => {
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { type, settleDate } = symbolInfo;
  const isSustain = type === SUSTAIN_CONTRACT;
  const isSettle = type === SETTLE_CONTRACT;
  const showSettle = useContractSettlement(symbol);

  const settleText = useMemo(() => {
    if (!settleDate) return '';
    return isSustain
      ? _t('futures.sustainTip', {
          settleDate: moment2Intl({
            date: settleDate,
            format: 'YYYY/MM/DD HH:mm:ss',
            timeZone: '8',
          }),
        })
      : _t('futures.settleTip', {
          settleDate: moment2Intl({
            date: settleDate,
            format: 'YYYY/MM/DD HH:mm:ss',
            timeZone: '8',
          }),
        });
  }, [isSustain, settleDate]);

  const toolTipText = useMemo(() => {
    if (!settleDate) return '';
    return isSustain
      ? _tHTML('futures.settleToolTip', {
          symbol: symbolToText(symbolInfo),
          settleDate: moment2Intl({
            date: settleDate,
            format: 'YYYY/MM/DD HH:mm:ss',
            timeZone: '8',
          }),
        })
      : '';
  }, [isSustain, settleDate, symbolInfo]);

  // 显示逻辑，永续 && 快下线 或者 交割合约 && showText
  const isShow = useMemo(() => {
    return (showSettle && isSustain) || (isSettle && showText);
  }, [showSettle, isSustain, isSettle, showText]);

  if (!isShow) return null;

  return (
    <Text tips={toolTipText} underline={false}>
      <SettleWrapper className={className} largeIcon={largeIcon}>
        <SettleIcon className="icon" />
        {showText ? <div className="settle-text">{settleText}</div> : null}
      </SettleWrapper>
    </Text>
  );
};

export default React.memo(SettleDateTip);
