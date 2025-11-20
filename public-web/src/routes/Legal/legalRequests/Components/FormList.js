/**
 * Owner: odan.ou@kupotech.com
 */
import styled from '@emotion/styled';
import { ICQuestionOutlined } from '@kux/icons';
import { Button, Checkbox, Form, Input, Radio, Select, TextArea, Tooltip } from '@kux/mui';
import { useResizeObserverBody } from 'hooks';
import React, { useCallback, useMemo, useState } from 'react';
import { eScreenStyle, eTheme, eTrueStyle, RequiredRules, valIsEmpty, _t } from '../utils';
import FormItemWrap from './FormItemWrap';
import UploadItem from './UploadItem';

const { FormItem, useWatch } = Form;

const FormTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 32px;
  text-align: initial;
  color: ${eTheme('text')};
  ${eScreenStyle('Max1200')`
    font-size: 20px;
  `}
  ${eScreenStyle('Max768')`
    font-size: 18px;
  `}
`;

const FormItemLabel = styled.span`
  padding-right: 10px;
`;

const TooltipWrap = styled.span`
  vertical-align: middle;
  padding-left: 2px;
`;

const CommonFormItemConf = {
  labelProps: { shrink: true },
  allowClear: true,
};

const LegalButton = styled(Button)`
  min-width: 240px;
  ${eTrueStyle('disabled')`
    cursor: not-allowed;
  `}
`;

const RedSpan = styled.span`
  color: #f65454;
  padding-right: 2px;
`;

const RetroDiv = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 16px;
  color: ${eTheme('text60')};
`;

/**
 * 表单列表
 * @param {{
 *  form: any,
 *  onFinish: Function,
 *  list: {
 *    label: React.ReactNode,
 *    name: React.ReactNode,
 *    max: number,
 *    rules?: any[],
 *    tip?: string,
 *    options?: any[],
 *    itemType?: string,
 *    required?: boolean,
 *    itemProps?: Record<string, any>,
 *    retro?: boolean,
 *  }[],
 *  title?: React.ReactNode,
 *  formItemLayout?: Record<string, any>,
 *  loading?: boolean,
 *  commonItemProps?: Record<string, any>,
 *  btnName?: string,
 *  formSuffix?: React.ReactNode,
 *  defaultRequired?: boolean,
 * }} props
 */
const FormList = (props) => {
  const {
    onFinish,
    form,
    title,
    list,
    formItemLayout,
    loading,
    commonItemProps,
    btnName,
    formSuffix,
    defaultRequired = true,
    retro,
  } = props;
  const { screen } = useResizeObserverBody();
  const isSmallScreen = screen === 'Max768';
  const requiredKeys = useMemo(() => {
    return list
      .filter(({ required = defaultRequired, name }) => required === true && !!name)
      .map((item) => item.name);
  }, [defaultRequired, list]);
  const [allowSubmit, setAllowSubmit] = useState(!requiredKeys.length);
  const onValuesChangeProp = formItemLayout?.onValuesChangeProp;
  const onValuesChange = useCallback(
    (changedValues, values) => {
      onValuesChangeProp?.(changedValues, values);
      if (!requiredKeys.length) return;
      const hasData = requiredKeys.every((key) => !valIsEmpty(values?.[key]));
      setAllowSubmit(hasData);
    },
    [requiredKeys],
  );
  return (
    <div>
      <Form
        layout="horizontal"
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        {title && <FormTitle screen={screen}>{title}</FormTitle>}
        {list.map((item) => {
          const {
            label,
            name,
            child,
            rules,
            max,
            itemType,
            options,
            tip,
            placeholder: placeholderProps,
            required = defaultRequired,
            itemProps,
            formItemProps,
            retro: retroItem = retro,
          } = item;
          let childContent;
          const formItemParams = {
            ...CommonFormItemConf,
            ...commonItemProps,
            ...itemProps,
          };
          if (child) {
            childContent = typeof child === 'function' ? child(formItemParams) : child;
          } else if (options) {
            if (itemType === 'radio') {
              childContent = (
                <Radio.Group>
                  {options.map(({ label: optionLabel, value }) => (
                    <Radio value={value} key={value}>
                      {optionLabel}
                    </Radio>
                  ))}
                </Radio.Group>
              );
            } else if (itemType === 'checkbox') {
              childContent = <Checkbox.Group options={options} />;
            } else {
              childContent = (
                <Select
                  placeholder={placeholderProps || _t('bW1aTWPjtKQ9yCjCjD1MPG', '请选择')}
                  allowClear
                  options={options}
                  fullWidth
                />
              );
            }
          } else if (itemType === 'file') {
            childContent = <UploadItem />;
          } else {
            const placeholder = placeholderProps || _t('rjsUL9iG1MRfiySu1ktvqX');
            if (itemType === 'textarea') {
              childContent = <TextArea placeholder={placeholder} defaultHeight={32} />;
            } else {
              childContent = <Input placeholder={placeholder} />;
            }
          }
          let formItemlabelTip = tip;
          if (tip) {
            formItemlabelTip = (
              <span>
                <TooltipWrap>
                  <Tooltip placement="top-end" title={tip}>
                    <ICQuestionOutlined className="pointer" size="15" />
                  </Tooltip>
                </TooltipWrap>
              </span>
            );
          }

          let formItemRules = !Array.isArray(rules) ? [] : rules;
          if (max) {
            formItemRules = [
              ...formItemRules,
              { max, message: `cannot be longer than ${max} characters` },
            ];
          }
          if (required) {
            formItemRules = [...RequiredRules, ...formItemRules];
          }
          //  <FormItemLabel onClick={onStopClick}>{formItemlabel}</FormItemLabel>
          const labelContent = !!label && (
            <FormItemLabel>
              {!!required && <RedSpan>*</RedSpan>}
              {label}
              {retroItem && formItemlabelTip}
            </FormItemLabel>
          );
          return (
            <FormItem
              {...formItemProps}
              label={retroItem ? undefined : labelContent}
              name={name}
              rules={formItemRules}
            >
              <FormItemWrap
                suffix={!retroItem && formItemlabelTip}
                {...formItemParams}
                prefixLabel={retroItem ? <RetroDiv>{labelContent}</RetroDiv> : undefined}
              >
                {childContent}
              </FormItemWrap>
            </FormItem>
          );
        })}
        <LegalButton
          type="primary"
          htmlType="submit"
          loading={loading}
          fullWidth={isSmallScreen}
          disabled={!allowSubmit}
        >
          {btnName || _t('submit')}
        </LegalButton>
        {formSuffix}
      </Form>
    </div>
  );
};

export default FormList;
