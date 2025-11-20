/**
 * Owner: garuda@kupotech.com
 * 自动调整风险限额确认弹框
 */
import React, { memo } from 'react';

import { useRiskLimitProps } from './hooks';

import {
  ResultWrapper,
  ResultBox,
  ResultItem,
  ResultLabel,
  ResultItemValue,
  PrettyCurrencyColor,
  DialogInfo,
  Alert,
} from './style';

import { formatNumber, _t, toPercent } from '../../../builtinCommon';

export const ResultValue = memo(({ value, children, type, fixed, primary = false }) => {
  const endUnit = type === 'lev' ? 'x' : '';
  return (
    <ResultItemValue className="result-value" primary={primary}>
      {value == null || value === ''
        ? '--'
        : children || `${formatNumber(value || 0, { pointed: true, fixed })}${endUnit}`}
    </ResultItemValue>
  );
});

const RiskLimitAutoChangeDialog = () => {
  const { riskLimitLevelInfo, userRiskLimit } = useRiskLimitProps();

  return (
    <>
      <DialogInfo>
        <ResultWrapper>
          <ResultItem>
            <ResultLabel />
            <ResultLabel className="result-label" title>
              {_t('operator.margin.current')}
            </ResultLabel>
            <ResultLabel className="result-label" title>
              {_t('operator.margin.after')}
            </ResultLabel>
          </ResultItem>
          <ResultBox className="result-box">
            <ResultItem className="result-item">
              <ResultLabel>{_t('contract.detail.riskLimit')}</ResultLabel>
              <ResultItemValue className="result-value">
                <PrettyCurrencyColor
                  value={userRiskLimit?.maxRiskLimit}
                  currency={riskLimitLevelInfo?.settleCurrency}
                  unitClassName="unit"
                />
              </ResultItemValue>
              <ResultItemValue className="result-value">
                <PrettyCurrencyColor
                  value={riskLimitLevelInfo?.maxRiskLimit}
                  currency={riskLimitLevelInfo?.settleCurrency}
                  unitClassName="unit"
                  primary
                />
              </ResultItemValue>
            </ResultItem>
            <ResultItem className="result-item">
              <ResultLabel>{_t('risk.limit.maxLeverage')}</ResultLabel>
              <ResultValue value={userRiskLimit?.maxLeverage} type="lev" />
              <ResultValue value={riskLimitLevelInfo?.maxLeverage} type="lev" primary />
            </ResultItem>
            <ResultItem className="result-item">
              <ResultLabel>{_t('risk.limit.maintainMargin')}</ResultLabel>
              <ResultItemValue className="result-value">
                {toPercent(userRiskLimit?.maintainMargin)}
              </ResultItemValue>
              <ResultItemValue className="result-value" primary>
                {toPercent(riskLimitLevelInfo?.maintainMargin)}
              </ResultItemValue>
            </ResultItem>
          </ResultBox>
        </ResultWrapper>
        <Alert className="alert-box" showIcon type="warning" title={_t('risk.limit.changeTips')} />
      </DialogInfo>
    </>
  );
};

export default memo(RiskLimitAutoChangeDialog);
