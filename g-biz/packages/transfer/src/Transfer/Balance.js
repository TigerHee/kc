/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import { Spin, Box } from '@kufox/mui';
import { useTranslation } from '@tools/i18n';
import { styled } from '@kux/mui';
// import { injectLocale } from '@kucoin-base/i18n';
import setNumToPrecision from '../utils/setNumToPrecision';
import separateNumber from '../utils/separateNumber';
import CoinCodeToName from '../components/CoinCodeToName';

const StyledSpan = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  margin-right: 4px;
`;
const Balance = React.memo(({ balance, currency, loading, onClick, style }) => {
  const { t: _t } = useTranslation('transfer');
  return (
    <Box display="flex" alignItems="center" style={style}>
      {_t('transfer.trans.avaliable')}：
      <Spin
        size="xsmall"
        spinning={!!loading}
        style={{
          minWidth: 14,
          overflow: 'hidden',
          display: 'inline-flex',
        }}
      >
        <StyledSpan onClick={() => onClick(balance)}>
          {separateNumber(setNumToPrecision(balance))}
        </StyledSpan>
      </Spin>
      {currency && <CoinCodeToName coin={currency} />}
    </Box>
  );
});

// export default React.memo(injectLocale(Balance));
export default React.memo(Balance);
