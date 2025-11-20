/*
 * @owner: borden@kupotech.com
 */
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';
import useMarginModel from '@/hooks/useMarginModel';
import { POSITION_STATUS_CONFIG } from '@/meta/margin';

export default function useMarginStatusConfig(params) {
  const {
    symbol,
    status: _status,
    liabilityRate: _liabilityRate,
  } = params || {};
  const { colors } = useTheme();
  const { statusInfo, accountConfigs, liabilityRate } = useMarginModel(
    ['statusInfo', 'accountConfigs', 'liabilityRate'],
    { symbol },
  );

  const status = _status || statusInfo.code;
  const { riskGrade = '' } = accountConfigs;
  const value = _liabilityRate === undefined ? +liabilityRate : _liabilityRate;

  return useMemo(() => {
    const positionStatusConfig = POSITION_STATUS_CONFIG[status];
    if (positionStatusConfig) {
      return {
        type: 'position',
        fontColor: colors.secondary,
        bgColor: colors.secondary12,
        label: positionStatusConfig.label,
        desc: positionStatusConfig.desc,
      };
    }
    // 中风险和高风险的界限
    const [risk1, risk2] = riskGrade.split(',');
    if (value >= 0 && value < +risk1) {
      return {
        fontColor: colors.primary,
        bgColor: colors.primary12,
        label: POSITION_STATUS_CONFIG.LOW.label,
      };
    } else if (value >= +risk1 && value < +risk2) {
      return {
        fontColor: colors.complementary,
        bgColor: colors.complementary12,
        label: POSITION_STATUS_CONFIG.MEDIUM.label,
      };
    } else if (value >= +risk2) {
      return {
        fontColor: colors.secondary,
        bgColor: colors.secondary12,
        label: POSITION_STATUS_CONFIG.HIGH.label,
      };
    }
    return {};
  }, [status, value, riskGrade, colors]);
}
