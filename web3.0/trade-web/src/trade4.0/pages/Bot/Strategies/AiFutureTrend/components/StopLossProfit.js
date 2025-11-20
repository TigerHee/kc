/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';
import { _t } from 'Bot/utils/lang';
import InputNumber from 'Bot/components/Common/InputNumber';
import { ParamRow } from 'Bot/components/Common/Row';
import { floatText } from 'Bot/helper';

const Selector = ({ onChange, value, min = 1, max = 100, controlRef }) => {
  max = +max ?? 99;
  min = +min ?? 1;
  const [innerVal, setVal] = useState(value);
  useEffect(() => {
    setVal(value);
  }, [value]);
  const onCancel = useCallback(() => {
    setVal('');
    onChange('');
    controlRef.current.close();
  }, []);
  useBindDialogButton(controlRef, {
    onConfirm: () => {
      onChange(innerVal);
      controlRef.current.close();
    },
    onCancel,
  });
  return (
    <InputNumber
      min={1}
      max={max}
      placeholder={`${1}-${max}`}
      fullWidth
      unit="%"
      onChange={setVal}
      value={innerVal}
    />
  );
};
/**
 * @description:
 * @param {*} controlRef
 * @param {array} rest
 */
const SelectorPop = ({ controlRef, meta, ...rest }) => {
  return (
    <DialogRef
      ref={controlRef}
      title={_t(meta.label)}
      cancelText={_t('reset')}
      okText={_t('gridwidget6')}
      cancelButtonProps={{ onClick: () => controlRef.current.cancel() }}
      onOk={() => controlRef.current.confirm()}
      onCancel={() => controlRef.current.close()}
    >
      <Selector controlRef={controlRef} {...rest} />
    </DialogRef>
  );
};

const sceneConfig = {
  stopLossPercent: {
    label: 'lossstop',
    formKey: 'stopLossPercent',
  },
  stopProfitPercent: {
    label: 'takeprofit',
    formKey: 'stopProfitPercent',
  },
};
/**
 * @description:
 * @return {*}
 */
export default ({ value, onChange, scene, min, max }) => {
  const controlRef = React.useRef();
  const meta = sceneConfig[scene];
  return (
    <>
      <ParamRow
        hasArrow
        mode="create"
        label={_t(meta.label)}
        checkUnSet
        rawValue={value}
        value={floatText(value)}
        show
        onClick={() => controlRef.current.show()}
        fs={12}
        mb={8}
      />
      <SelectorPop
        meta={meta}
        min={min}
        max={max}
        controlRef={controlRef}
        value={value}
        onChange={onChange}
      />
    </>
  );
};
