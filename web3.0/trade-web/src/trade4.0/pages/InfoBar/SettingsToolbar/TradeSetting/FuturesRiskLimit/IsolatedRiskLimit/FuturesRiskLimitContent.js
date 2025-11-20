/**
 * Owner: charles.yang@kupotech.com
 */
import React, {
  memo,
  useState,
  useMemo,
  useEffect,
  Fragment,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  RiskLimitTitle,
  RiskSelectContent,
  RiskTableHeaderWrapper,
  RiskTableItemTitle,
  RiskTableItemBefore,
  RiskTableItemAfter,
  RiskTableItem,
  RiskTableContent,
  RiskDescription,
} from '../../style';
import { isEqual } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency } from '@/utils/futures';
import { thousandPointed } from '@/utils/format';
import { FUTURES } from '@/meta/const';
import { useGetCurrentSymbol, useGetSymbolInfo } from '@/hooks/common/useSymbol';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { Select } from '@kux/mui';
import { guid, floadToPercent } from 'helper';
import { _t } from 'utils/lang';
import { trackClick } from 'src/utils/ga';
import { RISK_LIMIT } from '@/meta/futuresSensors/trade';

/**
 * FuturesRiskLimitContent
 * 合约风险限额内容区域
 */
const FuturesRiskLimitContent = (props, ref) => {
  const [lev, setLev] = useState(null);
  const { onOk = () => {} } = props;
  const dispatch = useDispatch();
  const currentSymbol = useGetCurrentSymbol();
  const contract = useGetSymbolInfo({ symbol: currentSymbol, tradeType: FUTURES });
  const { settleCurrency } = contract;
  const { isLogin } = useLoginDrawer();

  const userRiskLimit = useSelector((state) => state.futuresSetting.userRiskLimit, isEqual);
  const riskLimits = useSelector((state) => state.futuresSetting.riskLimits);
  const riskLimitsArray = riskLimits?.map(({ level, maxRiskLimit }) => {
    return {
      value: level,
      label: `${thousandPointed(maxRiskLimit)} ${formatCurrency(settleCurrency)}`,
    };
  });

  const limitInfo = useMemo(() => {
    if (lev !== null) {
      return riskLimits.find((item) => item.level === lev);
    }
    return null;
  }, [lev, riskLimits]);

  const showLimitInfo = useMemo(
    () => limitInfo && lev !== null && lev !== userRiskLimit.level,
    [lev, limitInfo, userRiskLimit.level],
  );

  useEffect(() => {
    if (userRiskLimit.level) {
      setLev(userRiskLimit.level);
    }
  }, [userRiskLimit]);

  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'futuresSetting/getSymbolAutoDeposit',
        payload: { symbol: currentSymbol },
      });
      dispatch({
        type: 'futuresSetting/getUserRiskLimit',
        payload: { symbol: currentSymbol },
      });
      dispatch({
        type: 'futuresSetting/getRiskLimits',
        payload: currentSymbol,
      });
    }
  }, [dispatch, currentSymbol, isLogin]);

  const handleSubmit = async () => {
    if (lev === userRiskLimit.level) {
      onOk();
      return;
    }
    try {
      const data = await dispatch({
        type: 'futuresSetting/postChangeRiskLimit',
        payload: { level: lev, symbol: currentSymbol, bizNo: guid(24, 16) },
      });
      if (data.success) {
        onOk();
        trackClick([RISK_LIMIT, '2'], {
          symbol: currentSymbol,
          number: lev,
          resultType: 'success',
        });
      }
    } catch (err) {
      trackClick([RISK_LIMIT, '2'], { symbol: currentSymbol, number: lev, resultType: 'fail' });
    }
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  return (
    <Fragment>
      <RiskLimitTitle>{_t('contract.detail.riskLimit')}</RiskLimitTitle>
      <RiskSelectContent>
        <Select
          options={riskLimitsArray}
          value={lev}
          classNames={{
            dropdownContainer: 'selectContainer',
          }}
          onChange={(value) => {
            setLev(value);
          }}
        />
      </RiskSelectContent>
      <RiskTableHeaderWrapper>
        <RiskTableItemTitle />
        <RiskTableItemBefore>{_t('risk.limit.config.now')}</RiskTableItemBefore>
        <RiskTableItemAfter>{_t('risk.limit.config.edit')}</RiskTableItemAfter>
      </RiskTableHeaderWrapper>
      <RiskTableContent>
        <RiskTableItem>
          <RiskTableItemTitle>{_t('risk.limit.maxLeverage')}</RiskTableItemTitle>
          <RiskTableItemBefore color={'text'}>
            {userRiskLimit.maxLeverage ? (
              <span className="amount">{`${userRiskLimit.maxLeverage}x`}</span>
            ) : (
              '-'
            )}
          </RiskTableItemBefore>
          <RiskTableItemAfter>
            {showLimitInfo ? <span className="value">{`${limitInfo.maxLeverage}x`}</span> : '-'}
          </RiskTableItemAfter>
        </RiskTableItem>
        <RiskTableItem>
          <RiskTableItemTitle>{_t('risk.limit.initialMargin')}</RiskTableItemTitle>
          <RiskTableItemBefore color={'text'}>
            <span className="amount">{floadToPercent(userRiskLimit.initialMargin, '%', 2)}</span>
          </RiskTableItemBefore>
          <RiskTableItemAfter>
            {showLimitInfo ? (
              <span className="value">{floadToPercent(limitInfo.initialMargin, '%', 2)}</span>
            ) : (
              '-'
            )}
          </RiskTableItemAfter>
        </RiskTableItem>
        <RiskTableItem>
          <RiskTableItemTitle>{_t('risk.limit.maintainMargin')}</RiskTableItemTitle>
          <RiskTableItemBefore color={'text'}>
            <span className="amount">{floadToPercent(userRiskLimit.maintainMargin, '%', 2)}</span>
          </RiskTableItemBefore>
          <RiskTableItemAfter>
            {showLimitInfo ? (
              <span className="value">{floadToPercent(limitInfo.maintainMargin, '%', 2)}</span>
            ) : (
              '-'
            )}
          </RiskTableItemAfter>
        </RiskTableItem>
      </RiskTableContent>
      <RiskDescription>{_t('risk.limit.change.explain')}</RiskDescription>
    </Fragment>
  );
};

export default memo(forwardRef(FuturesRiskLimitContent));
