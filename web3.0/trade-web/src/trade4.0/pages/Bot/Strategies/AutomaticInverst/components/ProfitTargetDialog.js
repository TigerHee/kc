/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { ChangeRate, InputNumber } from 'Bot/components';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { Radio, Divider } from '@kux/mui';
import useMergeState from 'Bot/hooks/useMergeState';
import { _t } from 'Bot/utils/lang';
import { formatNumber } from 'helper';
import { Text } from 'Bot/components/Widgets';
import Row from 'Bot/components/Common/Row';
import GridInput from 'Bot/components/Common/GridInput';
import Decimal from 'decimal.js';

const RadioGroup = styled(Radio.Group)`
  > label {
    display: flex;
    margin-bottom: 12px;
    color: ${(props) => props.theme.colors.text60};
  }
`;
const percents = [25, 50, 75, 100, 200, 500];
/**
 * @description: 盈利目标修改 ，创建、参数修改会用
 * @prop {Object} value {profitTarget, isTargetSellBase}
 * @prop {Boolean} showDescription 是否展示下面描述价格等信息
 * @prop {Object} symbolInfo 精度 当showDescription为true 必传
 * @prop {Object} open 当前委托数据  当showDescription为true 必传
 * @prop {} onChange
 * @prop {ReactRef} dialogRef
 * @return {*}
 */
const ProfitTarget = ({
  open,
  onChange,
  value,
  showDescription = false,
  symbolInfo,
  dialogRef,
}) => {
  const [{ profitTarget, isTargetSellBase }, setTarget] = useMergeState(value);

  const onConfirm = () => {
    onChange && onChange({ profitTarget, isTargetSellBase });
    dialogRef.current.toggle();
  };

  const onInputChange = useCallback(
    (val) => {
      setTarget({ profitTarget: val ? Number(val) : '' });
    },
    [setTarget],
  );

  // const onBlur = useCallback(
  //   (e) => {
  //     setTarget({ profitTarget: Math.max(1, e.target.value) });
  //   },
  //   [setTarget],
  // );

  const onRadioChange = useCallback(
    (e) => {
      setTarget({ isTargetSellBase: e.target.value });
    },
    [setTarget],
  );
  const onGridChange = useCallback((val) => {
    onInputChange(Decimal(val).times(100).toNumber());
  }, [onInputChange]);

  useBindDialogButton(dialogRef, {
    onConfirm,
  });
  return (
    <div className="pt-8">
      <InputNumber
        label={`${_t('auto.profittarget')} 1～500%`}
        min={1}
        max={500}
        unit="%"
        maxPrecision={0}
        value={profitTarget}
        onChange={onInputChange}
        // onBlur={onBlur}
        variant="default"
      />
      <GridInput percents={percents} onGridChange={onGridChange} mt={10} mb={16} />
      {showDescription && (
        <>
          <Row label={_t('auto.currentprofit')} value={<ChangeRate value={open.profitRate} />} />

          <Row
            label={_t('auto.currentprice')}
            unit={symbolInfo.quota}
            value={formatNumber(open.symbolCurrentPrice, symbolInfo.pricePrecision)}
          />
          <Row
            label={_t('auto.commonpricehold')}
            unit={symbolInfo.quota}
            value={formatNumber(open.avgBuyPrice, symbolInfo.pricePrecision)}
          />

          <Divider mt={12} mb={12} />
        </>
      )}

      <RadioGroup onChange={onRadioChange} value={isTargetSellBase}>
        <Radio value={0}>{_t('auto.autoinversthint1')}</Radio>
        <Radio value={1}>{_t('auto.autoinversthint2')}</Radio>
      </RadioGroup>
    </div>
  );
};

export default ({ dialogRef, ...rest }) => {
  return (
    <DialogRef
      ref={dialogRef}
      title={_t('auto.profittarget')}
      okText={_t('gridwidget6')}
      cancelText={null}
      size="medium"
      onCancel={() => dialogRef.current.close()}
      onOk={() => dialogRef.current.confirm()}
      maskClosable
    >
      <ProfitTarget {...rest} dialogRef={dialogRef} />
    </DialogRef>
  );
};
