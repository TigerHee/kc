/**
 * Owner: mike@kupotech.com
 */
import React, { useMemo } from 'react';
import { _t, _tHTML } from 'Bot/utils/lang';
import { floatToPercent, formatNumber } from 'Bot/helper';
import Row from 'Bot/components/Common/Row';
import { Text } from 'Bot/components/Widgets';

const GridText = React.memo(({ relatedParams, symbolInfo }) => {
  const { quota, precision } = symbolInfo;
  const { diff, gridProfitLowerRatio, gridProfitUpperRatio } = relatedParams;
  const gridProfit = useMemo(() => {
    if (gridProfitLowerRatio && gridProfitUpperRatio) {
      return `${floatToPercent(gridProfitLowerRatio, 2)} ~ ${floatToPercent(
        gridProfitUpperRatio,
        2,
      )}`;
    }
    return '--';
  }, [gridProfitLowerRatio, gridProfitUpperRatio]);
  return (
    <>
      <Row
        fs={12}
        mb={8}
        label={<Text color="text40">{_tHTML('futrgrid.griddiff', { quota })}</Text>}
        value={formatNumber(diff, precision)}
      />
      <Row fs={12} labelColor="text40" mb={0} label={_t('persellprofits')} value={gridProfit} />
    </>
  );
});

export default GridText;
