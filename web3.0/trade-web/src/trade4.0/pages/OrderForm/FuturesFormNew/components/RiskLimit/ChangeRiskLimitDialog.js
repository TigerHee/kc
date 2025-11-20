/**
 * Owner: garuda@kupotech.com
 */
import React, { memo, useState, useMemo, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@mui/Dialog';
import Select from '@mui/Select';

import ConfirmDialog from './ConfirmDialog';

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
} from './style';

import { guid, toPercent, _t, thousandPointed, formatCurrency } from '../../builtinCommon';

import {
  useLoginDrawer,
  useRiskLimit,
  useOperatorRiskLimit,
  useGetRiskLimit,
} from '../../builtinHooks';
import { useGetSymbolInfo } from '../../hooks/useGetData';

/**
 * ChangeRiskLimitDialog
 * 合约风险限额内容区域
 */
const ChangeRiskLimitDialog = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lev, setLev] = useState(null);
  const dispatch = useDispatch();

  const onlyRiskLimitChangeVisible = useSelector(
    (state) => state.futuresForm.onlyRiskLimitChangeVisible,
  );

  const { symbol: currentSymbol, symbolInfo } = useGetSymbolInfo();
  const { isLogin } = useLoginDrawer();

  const { userRiskLimit, riskLimits } = useRiskLimit();

  const operatorRiskLimit = useOperatorRiskLimit();
  const getRiskLimit = useGetRiskLimit();

  const riskLimitsArray = useMemo(
    () =>
      riskLimits?.map(({ level, maxRiskLimit }) => {
        return {
          value: level,
          label: `${thousandPointed(maxRiskLimit)} ${formatCurrency(symbolInfo?.settleCurrency)}`,
        };
      }),
    [riskLimits, symbolInfo.settleCurrency],
  );

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
      getRiskLimit(currentSymbol);
    }
  }, [dispatch, currentSymbol, isLogin, getRiskLimit]);

  const handleConfirmCancel = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        onlyRiskLimitChangeVisible: false,
      },
    });
  }, [dispatch]);

  const handleOpenConfirm = useCallback(() => {
    if (lev === userRiskLimit.level) {
      handleCancel();
      return;
    }
    setConfirmOpen(true);
  }, [handleCancel, lev, userRiskLimit.level]);

  const handleSubmit = useCallback(async () => {
    const data = await operatorRiskLimit({
      level: lev,
      symbol: currentSymbol,
      bizNo: guid(24, 16),
    });
    if (data.success) {
      handleCancel();
      handleConfirmCancel();
    }
  }, [currentSymbol, handleCancel, handleConfirmCancel, lev, operatorRiskLimit]);

  return (
    <>
      <Dialog
        title={_t('risk.limit.change.title')}
        open={onlyRiskLimitChangeVisible}
        onCancel={handleCancel}
        cancelText={_t('cancel')}
        okText={_t('security.form.btn')}
        onOk={handleOpenConfirm}
      >
        <>
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
                {userRiskLimit.maxLeverage ? `${userRiskLimit.maxLeverage}x` : '-'}
              </RiskTableItemBefore>
              <RiskTableItemAfter>
                {showLimitInfo ? <span className="value">{`${limitInfo.maxLeverage}x`}</span> : '-'}
              </RiskTableItemAfter>
            </RiskTableItem>
            <RiskTableItem>
              <RiskTableItemTitle>{_t('risk.limit.initialMargin')}</RiskTableItemTitle>
              <RiskTableItemBefore color={'text'}>
                {toPercent(userRiskLimit.initialMargin)}
              </RiskTableItemBefore>
              <RiskTableItemAfter>
                {showLimitInfo ? (
                  <span className="value">{toPercent(limitInfo.initialMargin)}</span>
                ) : (
                  '-'
                )}
              </RiskTableItemAfter>
            </RiskTableItem>
            <RiskTableItem>
              <RiskTableItemTitle>{_t('risk.limit.maintainMargin')}</RiskTableItemTitle>
              <RiskTableItemBefore color={'text'}>
                {toPercent(userRiskLimit.maintainMargin)}
              </RiskTableItemBefore>
              <RiskTableItemAfter>
                {showLimitInfo ? (
                  <span className="value">{toPercent(limitInfo.maintainMargin)}</span>
                ) : (
                  '-'
                )}
              </RiskTableItemAfter>
            </RiskTableItem>
          </RiskTableContent>
          <RiskDescription>{_t('risk.limit.change.explain')}</RiskDescription>
        </>
      </Dialog>
      <ConfirmDialog open={confirmOpen} onOk={handleSubmit} onCancel={handleConfirmCancel} />
    </>
  );
};

export default memo(ChangeRiskLimitDialog);
