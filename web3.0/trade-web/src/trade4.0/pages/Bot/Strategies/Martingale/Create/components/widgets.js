/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
import { useModel } from '../model';
import { InputSheetWrap, getLabelShow, titleConfig } from './InputSheet';
import { floatText } from 'Bot/helper';
import { showHintDialog, tipConfig } from 'Martingale/config';
import { _t, _tHTML } from 'Bot/utils/lang';
import { FormNumberInputItem } from 'Bot/components/Common/CForm';
import { Text, Flex } from 'Bot/components/Widgets';
import CycleOpenHint from 'FutureMartingale/components/CycleOpenHint';
import InfoPopover from 'FutureMartingale/components/InfoPopover';
import { InputDiv, MEditRow } from 'FutureMartingale/components/widgets';

/**
 * @description: 创建页面非必填的参数
 * @param {*} label
 * @param {*} value
 * @param {*} unit
 * @param {*} hintKey 解释的lang key
 * @param {*} onLabelClick
 * @param {*} className
 * @param {*} hintSheet 循环开仓解释
 * @param {*} inputSheet 是否可以修改参数
 * @param {*} context 消费context 可以修改 ，所以需要动态
 * @param {array} rest
 * @return {*}
 */
export const Row = ({
  label,
  value,
  unit,
  formKey,
  hintKey,
  onLabelClick,
  hintSheet,
  inputSheet,
  editRowProps = {},
  className,
  classLabelValueName = '',
  ...rest
}) => {
  // mode: edit | create
  const { formData = {}, symbolInfo = {}, mode, isStopped } = useModel() ?? {};
  const actionSheetRef = useRef();
  const onShowHint = () => {
    if (hintKey) {
      showHintDialog(hintKey);
    } else if (hintSheet) {
      actionSheetRef.current.toggle();
    } else {
      onLabelClick && onLabelClick();
    }
  };
  const inputSheetRef = useRef();
  const showInputSheet = () => {
    if (isStopped) return;
    inputSheetRef.current && inputSheetRef.current.toggle();
  };
  const rawValue = formData[formKey];
  value = getLabelShow(formKey) ? getLabelShow(formKey)({ formData, symbolInfo }) : rawValue;
  const showHint = !!hintKey || hintSheet;
  const showLabelHintLine = mode !== 'edit' && showHint;
  // 是否能编辑
  const canEdit = !!(hintSheet || inputSheet) && !isStopped;
  const { Dropdown } = titleConfig[formKey];
  if (Dropdown) {
    value = (
      <Dropdown formKey={formKey} disabled={!canEdit} >
        <span>{value || '--'}</span>
      </Dropdown>
    );
  } else {
    value = floatText(value || '--', unit ?? '');
  }

  const labelProps = { onClick: onShowHint };
  let rowProps = {};
  if (mode === 'edit') {
    labelProps.color = 'text60';
    rowProps = { mb: 12, fs: 14 };
  }

  const EditRowInner = (
    <MEditRow
      {...rowProps}
      {...editRowProps}
      hasDashLine={showHint}
      label={label}
      labelProps={labelProps}
      value={value}
      valueProps={{ onClick: showInputSheet }}
      hasArrow={canEdit}
    />
  );
  // 循环开仓
  if (Dropdown) {
    return (
      <>
        {EditRowInner}
        <CycleOpenHint actionSheetRef={actionSheetRef} direction={formData.direction} />
      </>
    );
  }
  return (
    <>
      {EditRowInner}
      {canEdit && <InputSheetWrap sheetRef={inputSheetRef} formKey={formKey} />}
    </>
  );
};

/**
 * @description: 创建页面必须要填写的参数
 * @param hintKey 解释lang key 默认展示下划线解释
 * @param withIconHint 用图标展示解释虚线
 * @return {*}
 */

export const InputRow = ({ formKey, hintKey, withIconHint, step = 0.1, ...rest }) => {
  const { formData, form } = useModel();
  const { label, getUnit, getHint, changeFetch, form: formRules } = titleConfig[formKey];
  const hint = getHint(formData);
  const changeHandler = (val, from) => {
    // if (!changeFetch) return;
  };
  const labeText = typeof label === 'function' ? label(formData) : label;
  const validator = (rule, value, cb) => {
    cb();
  };
  return (
    <InputDiv mb={12} {...rest}>
      <Flex vc>
        <Text as="div" mb={4} fs={12} color="text40" lh="130%">
          {_t(labeText)}
        </Text>
        {withIconHint && (
          <InfoPopover key={hintKey} toastHintConfig={React.useMemo(() => tipConfig(), [])} />
        )}
      </Flex>
      <FormNumberInputItem
        name={formKey}
        unit={getUnit()}
        rules={[
          {
            required: true,
            validator,
          },
        ]}
        maxPrecision={formRules.precision}
        onlyInteger={formRules.onlyInteger}
        placeholder={hint.placeholder}
        min={hint.min}
        max={hint.max}
        step={step}
        autoFixPrecision
        autoFixMinOnBlur
        disabled={formData.hasPrizeId}
        onChange={changeHandler}
      />
    </InputDiv>
  );
};
