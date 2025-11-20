/**
 * Owner: garuda@kupotech.com
 */
import React, { useState, useEffect } from 'react';

import Dialog from '@mui/Dialog';
import Radio from '@mui/Radio';

import { _t, formatCurrency, QUANTITY_UNIT, CURRENCY_UNIT, styled } from '../../builtinCommon';

const DialogWrapper = styled(Dialog)`
  .KuxModalFooter-root {
    padding: 20px 32px;
    border-top: 1px solid ${(props) => props.theme.colors.divider8};
  }
  .KuxDialog-content {
    padding: 12px 32px 44px;
  }
`;

const ListItemRadio = styled(Radio)`
  display: flex;
  align-items: flex-start;
  margin: 0;
  width: 100%;

  &:not(:last-of-type) {
    margin-bottom: 24px;
  }

  .KuxRadio-radio {
    margin: 0 8px 0 0;
  }
  .KuxRadio-text {
    width: 100%;
  }
`;

const ListItemContentTitle = styled.div`
  display: flex;
  width: 100%;
  ${(props) => props.theme.colors.text}
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 8px;
`;

const ListItemContentUnit = styled.div`
  white-space: nowrap;
`;

const ListItemContentWord = styled.div`
  max-width: 80%;
  margin-right: 4px;
  white-space: normal;
  word-break: break-word;
`;

const ListItemContentDesc = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
`;

const QtyModal = ({
  open,
  onClose,
  quoteCurrency,
  baseCurrency,
  multiplier,
  tradingUnit,
  chooseUSDsUnit,
  onOk,
}) => {
  const [radioValue, setRadioValue] = useState(QUANTITY_UNIT);

  const changeEvent = (e) => {
    setRadioValue(e.target.value);
  };

  const okEvent = () => {
    onOk(radioValue);
  };

  useEffect(() => {
    if (open) {
      setRadioValue(chooseUSDsUnit ? quoteCurrency : tradingUnit);
    }
  }, [tradingUnit, chooseUSDsUnit, quoteCurrency, open]);

  return (
    <DialogWrapper
      open={open}
      onClose={onClose}
      onOk={okEvent}
      cancelText={_t('cancel')}
      okText={_t('security.form.btn')}
      title={_t('order.placement.preferences')}
    >
      <Radio.Group size="small" onChange={changeEvent} value={radioValue}>
        <ListItemRadio value={QUANTITY_UNIT}>
          <ListItemContentTitle>
            <ListItemContentWord>
              {_t('order.placement.preferences.global.unit')}
            </ListItemContentWord>
            <ListItemContentUnit>{_t('global.unit')}</ListItemContentUnit>
          </ListItemContentTitle>
          <ListItemContentDesc>
            {`1 ${_t('global.unit')} = ${multiplier} ${formatCurrency(baseCurrency)}`}
          </ListItemContentDesc>
        </ListItemRadio>
        <ListItemRadio value={CURRENCY_UNIT}>
          <ListItemContentTitle>
            <ListItemContentWord>{_t('order.placement.preferences.unit')}</ListItemContentWord>
            <ListItemContentUnit>{formatCurrency(baseCurrency)}</ListItemContentUnit>
          </ListItemContentTitle>
          <ListItemContentDesc>
            {_t('order.placement.preferences.unit.desc', {
              currency: formatCurrency(baseCurrency),
            })}
          </ListItemContentDesc>
        </ListItemRadio>
        <ListItemRadio value={quoteCurrency}>
          <ListItemContentTitle>
            <ListItemContentWord>{_t('order.placement.preferences.usds')}</ListItemContentWord>
            <ListItemContentUnit>{quoteCurrency}</ListItemContentUnit>
          </ListItemContentTitle>
          <ListItemContentDesc>{_t('order.placement.preferences.usds.desc')}</ListItemContentDesc>
        </ListItemRadio>
      </Radio.Group>
    </DialogWrapper>
  );
};

export default QtyModal;
