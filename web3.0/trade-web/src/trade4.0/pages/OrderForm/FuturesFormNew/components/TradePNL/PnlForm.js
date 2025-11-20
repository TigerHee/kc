/**
 * Owner: garuda@kupotech.com
 */
import React, { useRef, useCallback, useMemo, useImperativeHandle } from 'react';

import Form from '@mui/Form';

import { LONG_TYPE, PROFIT_TYPE } from './config';
import PriceType from './PriceType';
import SizeRate from './SizeRate';
import priceValidator from './validator';

import { _t, withYScreen, styled } from '../../builtinCommon';
import { FormNumberItem, TooltipWrapper } from '../../builtinComponents';
import { useSetTooltip } from '../../builtinHooks';

import { useGetSymbolInfo, useGetYSmall } from '../../hooks/useGetData';
import { getPlaceholder } from '../../utils';

const PnlFormWrapper = withYScreen(styled.div`
  margin: 0 0 12px;
  &.futures-pnl-form .trade-form-item {
    margin: 0;
  }
  ${(props) => props.$useCss(['md', 'sm'])(`margin: 0 0 5px;`)}
`);

const PnlFormLabelBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 4px;
  .pnl-tooltip {
    margin-right: 4px;
    font-size: 12px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};
    text-decoration: underline dashed ${(props) => props.theme.colors.text20};
    cursor: help;
  }
  .dropdown-value {
    font-size: 12px;
    line-height: 1.3;
    font-weight: 400;
  }
`;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  line-height: 20px;
`;

const { useFormInstance, useWatch } = Form;

const PnlForm = ({ name, priceTypeName, lev, openPrice, pnlType, inputType, isMarket }, ref) => {
  const form = useFormInstance();
  const rateRef = useRef(null);

  const { symbolInfo: contract } = useGetSymbolInfo();
  const { onSetTooltipClose, onSetTooltipTitle } = useSetTooltip();

  const errorMessage = form.getFieldError(name);
  const priceTypeValue = useWatch(priceTypeName, form);
  const side = pnlType === LONG_TYPE ? 1 : -1;

  const disabled = !openPrice || !lev;

  const isYScreenSM = useGetYSmall();

  const propsSize = useMemo(() => {
    return isYScreenSM ? 'small' : 'medium';
  }, [isYScreenSM]);

  const handleSetRateValue = useCallback((v) => {
    if (rateRef && rateRef.current) {
      rateRef.current.handleCalcRate(v);
    }
  }, []);

  const precision = useMemo(
    () => (priceTypeValue === 'TP' ? contract?.tickSize : contract?.indexPriceTickSize),
    [contract, priceTypeValue],
  );

  const validator = useCallback(
    (__, value) => {
      if (!value) {
        handleSetRateValue(0);
        return Promise.resolve();
      }
      const stopPriceType = form.getFieldValue(priceTypeName) || 'TP';
      const message = priceValidator(
        { openPrice, lev, formPrice: value, side, inputType, stopPriceType },
        pnlType,
        _t,
      );
      if (message) {
        return Promise.reject(message);
      }
      handleSetRateValue(value);
      return Promise.resolve();
    },
    // 屏蔽 form.getFieldValue 的变动
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSetRateValue, inputType, side, lev, openPrice, pnlType],
  );

  const handleResetRateValue = () => {
    handleSetRateValue(0);
  };

  const handleSetFormValue = (v) => {
    const stopPriceType = form.getFieldValue(priceTypeName) || 'TP';
    const validateResult = priceValidator(
      { openPrice, lev, formPrice: v, side, inputType, stopPriceType },
      pnlType,
      _t,
    );
    if (!validateResult) {
      form.setFields([{ name, value: v, errors: [] }]);
      onSetTooltipClose(name);
    } else {
      form.setFields([{ name, value: v, errors: [validateResult] }]);
      onSetTooltipTitle({ name, message: validateResult });
    }
  };

  useImperativeHandle(ref, () => ({
    handleResetRateValue,
  }));

  return (
    <PnlFormWrapper className="futures-pnl-form">
      <FormNumberItem
        name={name}
        label={
          <PnlFormLabelBox>
            <TooltipWrapper
              isTip
              className="pnl-tooltip"
              title={_t(inputType === PROFIT_TYPE ? 'pnl.profitRate.tip' : 'pnl.lossRate.tip')}
            >
              {_t(inputType === PROFIT_TYPE ? 'stopClose.profit' : 'stopClose.loss')}
            </TooltipWrapper>
            <PriceType disabled={disabled} name={priceTypeName} />
          </PnlFormLabelBox>
        }
        unit={<div className="input-currency">{contract?.quoteCurrency}</div>}
        validator={validator}
        disabled={disabled}
        placeholder={getPlaceholder(precision)}
        step={precision}
        inputProps={{
          size: propsSize,
        }}
      />
      {!isMarket ? (
        <ItemBox>
          <SizeRate
            contract={contract}
            pnlType={pnlType}
            openPrice={openPrice}
            lev={lev}
            setFormValue={handleSetFormValue}
            disabled={disabled}
            type={inputType}
            isError={errorMessage && errorMessage[0]}
            ref={rateRef}
            propsSize={propsSize}
            precision={precision}
          />
        </ItemBox>
      ) : null}
    </PnlFormWrapper>
  );
};

export default React.memo(React.forwardRef(PnlForm));
