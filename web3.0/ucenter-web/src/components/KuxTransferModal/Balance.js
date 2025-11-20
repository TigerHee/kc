/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Chrise
 * @Date: 2021-08-13 17:02:07
 * @FilePath: /kucoin-main-web/src/components/TransferModal/Balance.js
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Box, Spin, styled } from '@kux/mui';
import CoinCodeToName from 'components/common/CoinCodeToName';
import NumberFormat from 'components/common/NumberFormat';
import { setNumToPrecision } from 'helper';
import React from 'react';
import { _t } from 'tools/i18n';

const StyledSpan = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  min-width: 24px;
  display: inline-block;
  text-align: center;
  margin-right: 4px;
`;
const Balance = React.memo(({ balance, currency, loading, onClick, style }) => {
  return (
    <Box display="flex" alignItems="center" style={style}>
      {_t('transfer.trans.avaliable')}：
      <Spin
        size="xsmall"
        type="normal"
        spinning={!!loading}
        style={{
          minWidth: 14,
          overflow: 'hidden',
          display: 'inline-flex',
        }}
      >
        <StyledSpan onClick={() => onClick(balance)}>
          <NumberFormat>{setNumToPrecision(balance)}</NumberFormat>
        </StyledSpan>
      </Spin>
      {currency && <CoinCodeToName coin={currency} />}
    </Box>
  );
});

export default React.memo(injectLocale(Balance));
