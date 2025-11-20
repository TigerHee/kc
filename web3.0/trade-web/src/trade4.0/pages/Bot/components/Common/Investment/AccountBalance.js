/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { useDispatch } from 'dva';
import { useTheme } from '@kux/mui';
import { readableNumber } from 'src/helper';
import { _t } from 'Bot/utils/lang';
import withAuth from '@/hocs/withAuth';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import SvgComponent from '@/components/SvgComponent';
import styled from '@emotion/styled';
import useBalance from 'Bot/hooks/useBalance';
import useSymbolInfo from 'Bot/hooks/useSymbolInfo';
import { Flex, Text } from 'Bot/components/Widgets';
import { ACCOUNT_CODE } from '@/meta/const';

export const DropdownLabelIcon = styled(SvgComponent)`
  margin-left: 2px;
`;

const DropdownLabel = withAuth((props) => (
  <DropdownLabelIcon size={14} type="plus" fileName="orderForm" {...props} />
));
/**
 * @description: 显示模板
 * @param {*} value
 * @param {*} quoteName
 * @param {*} quoteCurrency
 * @return {*}
 */
const Template = ({ value, quoteName, quoteCurrency, onBalanceClick, ...rest }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const onRestClick = () => {
    onBalanceClick && onBalanceClick();
  };
  return (
    <Flex sb vc hc mb="10" mt="8" {...rest}>
      <Text fs="12" color="text40" className="balance-name">
        {_t('smart.available')}
      </Text>
      <Flex vc hc>
        <Text ft="500" color="text" fs="12" onClick={onRestClick} className="balance-value">
          {readableNumber(value)} {quoteName}
        </Text>
        <DropdownLabel
          color={colors.primary}
          type="transfer"
          className="pointer"
          onClick={() => {
            dispatch({
              type: 'transfer/updateTransferConfig',
              payload: {
                initDict: [[ACCOUNT_CODE.MAIN], [ACCOUNT_CODE.TRADE]],
                visible: true,
                initCurrency: quoteCurrency,
              },
            });
          }}
        />
      </Flex>
    </Flex>
  );
};
/**
 * 币币可用资产, 适用用现货/合约场景
 * @param {symbol?} symbol 现货/合约symbolCode, 没传就获取左上角选择的交易对
 */
const Balance = React.memo(({ symbolInfo, onChange, ...rest }) => {
  const { quoteAmount } = useBalance(symbolInfo, 0, false);
  React.useEffect(() => {
    onChange && onChange(quoteAmount);
  }, [quoteAmount]);
  return <Template value={quoteAmount} {...rest} />;
});

/**
 * @description: 显示账户可用余额: 适用于现货合约
 * 如果外部传入quoteAmount, 就用外部的值显示;没有就根据交易对去获取可用余额
 * @param {symbol?} symbol 现货/合约symbolCode, 没传就获取左上角选择的交易对
 * @return {*}
 */
export default ({ quoteAmount, symbol, symbolCode, ...rest }) => {
  let symbolCodeHere = symbol || symbolCode;
  const currentSymbol = useGetCurrentSymbol();
  symbolCodeHere = symbolCodeHere ?? currentSymbol;
  const symbolInfo = useSymbolInfo(symbolCodeHere);
  const { cquota: quoteCurrency, quota: quoteName } = symbolInfo || {};

  if (quoteAmount !== undefined) {
    // 外部传入可用余额
    return (
      <Template value={quoteAmount} quoteName={quoteName} quoteCurrency={quoteCurrency} {...rest} />
    );
  }
  return (
    <Balance
      symbolInfo={symbolInfo}
      quoteName={quoteName}
      quoteCurrency={quoteCurrency}
      {...rest}
    />
  );
};
