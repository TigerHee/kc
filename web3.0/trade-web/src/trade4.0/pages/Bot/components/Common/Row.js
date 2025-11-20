/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Text, Flex, DashText } from 'Bot/components/Widgets';
import styled from '@emotion/styled';
import { MIcons } from 'Bot/components/Common/Icon';
import isEmpty from 'lodash/isEmpty';
import { _t, _tHTML } from 'Bot/utils/lang';
import { isNull } from 'Bot/helper';
import Popover from 'Bot/components/Common/Popover';
import MPopover from 'Bot/Strategies/components/LabelPopover';

const Row = styled(Flex)`
  &:last-of-type {
    margin-bottom: 0 !important;
  }
  column-gap: 16px;
  .row-label {
    max-width: 60%;
  }
  .row-value {
    max-width: 40%;
    text-align: right;
  }
`;
/**
 * @description:
 * @param {*} true
 * @param {array} rest
 * @return {*}
 */
export default ({ label, labelColor, value, labelProps = {}, valueProps = {}, unit, ...rest }) => {
  return (
    <Row sb vc fs={14} lh="130%" mb={12} {...rest}>
      {React.isValidElement(label) ? (
        label
      ) : (
        <Text className="row-label" color={labelColor ?? 'text60'} {...labelProps}>
          {label}
        </Text>
      )}
      {React.isValidElement(value) ? (
        value
      ) : (
        <Text className="row-value" color="text" {...valueProps}>
          {value}
          {!!unit && <>&nbsp;{unit}</> }
        </Text>
      )}
    </Row>
  );
};

/**
 * @description: 带有箭头的可以编辑的row
 * @param {*} label
 * @param {*} value
 * @param {boolean} hasArrow
 * @param {*} labelProps
 * @param {*} valueProps
 * @param {array} rest
 * @return {*}
 */
export const EditRow = ({
  label,
  value,
  unit,
  hasArrow = true,
  labelProps = {},
  valueProps = {},
  valueSlot,
  ...rest
}) => {
  const showValue = valueSlot || (
    <Text color="text" className="editRow-value" {...valueProps}>
      {value}
      {!!unit && <>&nbsp;{unit}</> }
    </Text>
  );
  return (
    <Row sb vc fs={12} cursor={hasArrow} mb={10} {...rest}>
      <Text color="text40" className="editRow-label row-label" {...labelProps}>
        {label}
      </Text>
      {hasArrow ? (
        <Flex vc className="row-value">
          {showValue}
          <MIcons.ArrowRight color="icon" size={12} className="ml-2" />
        </Flex>
      ) : (
        showValue
      )}
    </Row>
  );
};
const isUnSet = (val) => {
  return ['0', 0, '', null, undefined].includes(val);
};
/**
 * @description: 有值就显示, 没有就显示 未设置
 * @return {*}
 */
export const Unset = ({ value, show }) => {
  if (!isNull(value)) {
    return show;
  }
  return <Text color="text40">{_t('robotparams7')}</Text>;
};
/**
 * @description: 订单参数页面使用
 * @param {enum} (param, create) 标记是创建页面使用, 还是参数设置页面设置, 两边样式有点不一样
 * @param {*} hasArrow
 * @param {*} label
 * @param {*} rawValue 用于判断是否为空
 * @param {*} value 直接显示在页面上的值
 * @param {*} labelPopoverContent popover提示的内容
 * @param {*} unit
 * @param {boolean} checkUnSet 是否没有设置的时候, 显示未设置
 * @return {*}
 */
export const ParamRow = ({
  mode = 'param',
  labelPopoverContent,
  tipKey,
  straName,
  hasArrow = false,
  label,
  value,
  rawValue,
  unit,
  checkUnSet,
  ...rest
}) => {
  let valueProps = {};
  if (isUnSet(rawValue) && checkUnSet) {
    valueProps = { color: 'text40' };
    unit = false;
    value = _t('robotparams7');
  }
  if (tipKey && straName) {
    // 从配置读取内容
    label = (
      <MPopover tipKey={tipKey} straName={straName}>
        {label}
      </MPopover>
    );
  } else if (labelPopoverContent && label) {
    // 直接展示labelPopoverContent
    label = (
      <Popover placement="top" content={<p className="fs-14">{labelPopoverContent}</p>}>
        <DashText>{label}</DashText>
      </Popover>
    );
  }
  const labelProps = { color: 'text60' };
  if (mode === 'create') {
    labelProps.color = 'text40';
  }
  return (
    <EditRow
      valueProps={valueProps}
      labelProps={labelProps}
      hasArrow={hasArrow}
      label={label}
      mb={12}
      fs={14}
      value={value}
      unit={unit}
      {...rest}
    />
  );
};
