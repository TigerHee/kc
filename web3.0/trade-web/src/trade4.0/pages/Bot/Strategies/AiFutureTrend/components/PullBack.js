/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { ParamRow } from 'Bot/components/Common/Row';
import { createMarks, floatText } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';
import GridInput from 'Bot/components/Common/GridInput';
import Decimal from 'decimal.js';

const Selector = ({ step = 10, onChange, value, min = 10, max = 50, controlRef }) => {
  min = +min;
  max = +max;
  let marks = createMarks({ min, max, step, unit: '%' });
  marks = marks.map((el) => el.value);
  const [innerVal, setVal] = useState(value);
  useEffect(() => {
    setVal(value);
  }, [value]);

  const onConfirm = () => {
    onChange(innerVal);
    controlRef.current.close();
  };
  const onGridChange = useCallback((val) => {
    setVal(Decimal(val).times(100).toNumber());
  }, []);
  useBindDialogButton(controlRef, {
    onConfirm,
  });
  return <GridInput percents={marks} value={innerVal} onGridChange={onGridChange} />;
};
/**
 * @description: 杠杆倍数弹窗选择器
 * @param {*} controlRef
 * @param {array} rest
 */
const SelectorPop = ({ controlRef, ...rest }) => {
  return (
    <DialogRef
      ref={controlRef}
      title={_t('bearmaxback')}
      onOk={() => controlRef.current.confirm()}
      onCancel={() => controlRef.current.close()}
      cancelText={_t('machinecopydialog7')}
      okText={_t('gridwidget6')}
    >
      <Selector controlRef={controlRef} {...rest} />
    </DialogRef>
  );
};

export default ({ value, onChange }) => {
  const controlRef = React.useRef();
  return (
    <>
      <ParamRow
        hasArrow
        mode="create"
        label={_t('bearmaxback')}
        labelTipKey="bearmaxback"
        straName="FUTURES_CTA"
        checkUnSet
        rawValue={value}
        value={floatText(value)}
        onClick={() => controlRef.current.show()}
        fs={12}
        mb={8}
      />
      <SelectorPop controlRef={controlRef} value={value} onChange={onChange} />
    </>
  );
};
