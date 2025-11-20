/**
 * Owner: tiger@kupotech.com
 * 表单项渲染
 */
// eslint-disable-next-line no-restricted-imports
import moment from 'moment';
import { isString, isNaN } from 'lodash-es';
import { useEffect, useState, useMemo } from 'react';
import { Form } from '@kux/mui';
import clsx from 'clsx';
import useLang from 'packages/kyc/src/hookTool/useLang';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { PHONE_CODE, EXPIRY_DATE_CODE } from 'kycCompliance/config';
import { expiryDateTypeKey, expiryDateType2 } from './ExpiryDateSelect';
import { EmptyCom } from './style';
import { FormItemRenderComponentMap, baseFormComponentProps, getMetaCodeKey } from './formConfig';

const { FormItem } = Form;

// complianceMetaCode 2 componentCode
export const MetaCode2CodeMap = {};
// componentCode 2 complianceMetaCode
export const Code2MetaCodeMap = {};
// complianceMetaCode 2 complianceMetaAlias
export const MetaCode2AliasMap = {};
// complianceMetaAlias 2 complianceMetaCode
export const Alias2MetaCodeMap = {};
// 当前页所有 complianceMetaCode
export const MetaCodeList = [];
// 日期组件 complianceMetaCode
export const DateMetaCodeList = [];

// FormItem
const FormItemRender = ({
  componentItem,
  relationHideMetaCodeList,
  relationShowMetaCodeList,
  relationDefaultShowList,
  relationDefaultHideList,
  relationRequiredList,
  ...itemUseGroupProps
}) => {
  const { _t } = useLang();
  const { formData, ocrData } = useCommonData();
  const {
    complianceMetaCode,
    complianceMetaData,
    componentTitle,
    componentType,
    componentCode,
    componentDefaultMetaData, // 默认值
    complianceMetaAlias, // 要素别名
    uiConfig,
  } = componentItem;

  // 优先从 uiConfig 取值
  const {
    isOptional, // 是否选填 0-否 1-是
    isOcrInput, // 是否需要ocr填写 0-否 1-是
    ocrSource, // 第三方服务ocr对应字段
    isDisplay, // 是否展示属性 0-否 1-是
    isDisable, // 是否禁用属性 0-否 1-是
    isMultiChoice, // 是否多选 0-否 1-是
  } = { ...componentItem, ...uiConfig };

  // 某些组件要根据接口返回设置label
  const [label, setLabel] = useState('');

  // 缓存一些code相关的数据
  useEffect(() => {
    // 由于一些奇怪的逻辑需要一些映射关系
    if (componentCode) {
      MetaCode2CodeMap[complianceMetaCode] = componentCode;
      Code2MetaCodeMap[componentCode] = complianceMetaCode;
      MetaCode2AliasMap[complianceMetaCode] = complianceMetaAlias;
      Alias2MetaCodeMap[complianceMetaAlias] = complianceMetaCode;
    }
    if (!MetaCodeList.includes(complianceMetaCode)) {
      MetaCodeList.push(complianceMetaCode);
    }
    if (componentType === 4 && !DateMetaCodeList.includes(complianceMetaCode)) {
      DateMetaCodeList.push(complianceMetaCode);
    }
  }, []);

  // 获取 FormItem name
  const getName = () => {
    if ([PHONE_CODE, EXPIRY_DATE_CODE].includes(componentCode)) {
      return componentCode;
    }
    if (complianceMetaCode) {
      return complianceMetaCode;
    }
    return getMetaCodeKey({
      metaCode: complianceMetaCode,
      groupId: itemUseGroupProps.componentGroupId,
      pageId: itemUseGroupProps.pageId,
      ...componentItem,
    });
  };

  // 获取 FormItem initialValue
  const getInitialValue = () => {
    const ocrVal = isOcrInput ? ocrData[ocrSource] : '';
    const val = formData[complianceMetaCode] || complianceMetaData || componentDefaultMetaData || ocrVal;

    if (componentType === 2) {
      return formData[complianceMetaCode] || [];
    }
    if (!val) {
      return isMultiChoice ? [] : '';
    }
    if (isMultiChoice && isString(val)) {
      return val?.split(',') || [];
    }
    if (componentCode === PHONE_CODE) {
      const arr = val?.split('-');
      // setExtraInitialValue(arr[0]);
      return arr[1];
    }
    if (componentType === 4 || componentCode === EXPIRY_DATE_CODE) {
      let timeVal = val;
      if (!isNaN(Number(val))) {
        timeVal = Number(val);
      } else if (isString(val) && val.includes('-')) {
        timeVal = val.replace(/-/g, '/');
      }
      const momentVal = moment.utc(timeVal).add(8, 'hours');
      if (momentVal.isValid()) {
        return momentVal;
      }
      return '';
    }
    return val;
  };

  // 额外字段回填 (手机区号)
  const getExtraInitialValue = () => {
    const val = formData[complianceMetaCode] || complianceMetaData;
    if (!val) {
      return '';
    }
    if (componentCode === PHONE_CODE) {
      const arr = val?.split('-');
      return arr[0];
    }
    return '';
  };

  // 真实渲染的表单组件
  const FormItemRenderComponent =
    (componentType === 0 ? FormItemRenderComponentMap[componentCode] : FormItemRenderComponentMap[componentType]) ||
    EmptyCom;

  // 组件是否隐藏
  const isComponentHide = useMemo(() => {
    if (relationDefaultShowList.includes(complianceMetaCode)) {
      if (relationHideMetaCodeList.includes(complianceMetaCode)) {
        return true;
      }
      return false;
    }
    if (relationDefaultHideList.includes(complianceMetaCode)) {
      if (relationShowMetaCodeList.includes(complianceMetaCode)) {
        return false;
      }
      return true;
    }

    return !isDisplay;
  }, [
    isDisplay,
    complianceMetaCode,
    relationShowMetaCodeList,
    relationHideMetaCodeList,
    relationDefaultShowList,
    relationDefaultHideList,
  ]);

  // 是否非必填
  const isNotRequired = () => {
    if (isComponentHide) {
      return true;
    }
    // 联动显示的组件必填
    if (relationShowMetaCodeList.includes(complianceMetaCode)) {
      return false;
    }
    // 联动隐藏的组件非必填
    if (relationHideMetaCodeList.includes(complianceMetaCode)) {
      return true;
    }
    if (!complianceMetaCode) {
      return true;
    }
    if (isOptional) {
      // 选填
      return true;
    }
    if ([3].includes(componentType)) {
      return true;
    }
    if (componentCode === EXPIRY_DATE_CODE && formData[expiryDateTypeKey] === expiryDateType2) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      itemUseGroupProps.setHideComponentMap(pre => ({
        ...pre,
        [complianceMetaCode]: isComponentHide,
      }));
    });
  }, [isComponentHide]);

  return (
    <div
      className={clsx({
        COMPONENT_ITEM: true,
        componentHide: isComponentHide,
        itemHelp24: componentType === 3,
      })}
      data-compliancemetacode={complianceMetaCode}
      data-componentcode={componentCode}
    >
      <FormItem
        name={getName()}
        label={label || componentTitle}
        initialValue={getInitialValue()}
        // validateTrigger="onSubmit"
        rules={
          isNotRequired()
            ? []
            : [
                { required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') },
                {
                  validator(_, value) {
                    if (!String(value).trim()) {
                      return Promise.reject(new Error(_t('mR67a17ZzFE7hFLdM9tJvJ')));
                    }
                    return Promise.resolve();
                  },
                },
              ]
        }
      >
        <FormItemRenderComponent
          {...componentItem}
          {...baseFormComponentProps}
          {...itemUseGroupProps}
          placeholder={label || componentTitle}
          setLabel={setLabel}
          extraInitialValue={getExtraInitialValue()}
          disabled={Boolean(isDisable)}
          name={getName()}
          isMultiChoice={Boolean(isMultiChoice)}
        />
      </FormItem>
    </div>
  );
};

export default FormItemRender;
