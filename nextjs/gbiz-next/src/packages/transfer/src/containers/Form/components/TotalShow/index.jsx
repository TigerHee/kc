/**
 * Owner: solar@kupotech.com
 */
import { useTranslation } from 'tools/i18n';
import { StyledTotalShow } from './style';
import { useTransferSelector } from '../../../../utils/redux';
import { setNumToPrecision } from '../../../../utils/number';
import NumberFormat from '../../../../components/NumberFormat';
import { useCoinCodeToName } from '../../../../hooks/currency';

export default function TotalShow() {
  const { t: _t } = useTranslation('transfer');
  const total = useTransferSelector((state) => state.total);
  const precision = useTransferSelector((state) => state.precision);
  const currencyName = useCoinCodeToName();

  return (
    <StyledTotalShow>
      {_t('transfer.trans.avaliable')}：
      <span className="amount-wrapper">
        <NumberFormat>{setNumToPrecision(total, precision)}</NumberFormat>
      </span>
      {currencyName}
    </StyledTotalShow>
  );
}
