/**
 * Owner: tiger@kupotech.com
 * 组装表单页
 */
import { cloneDeep, isEmpty, isString } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { Form, useSnackbar } from '@kux/mui';
import classnames from 'classnames';
import { kcsensorsClick } from '@packages/kyc/src/common/tools';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { postJsonWithPrefix } from '@kycCompliance/service';
import {
  kcsensorsBlockidMap,
  PHONE_CODE,
  EXPIRY_DATE_CODE,
  ISSUE_COUNTRY_ALIAS,
  ISSUE_COUNTRY_2_ALIAS,
  ID_TYPE_ALIAS,
  ID_TYPE_2_ALIAS,
  getJsonStringToObj,
} from '@kycCompliance/config';
import { Wrapper, ContentBox, FooterBtnBox } from '@kycCompliance/components/commonStyle';
import { expiryDateTypeKey, MAX_DATE_VAL, expiryDateType2 } from './ExpiryDateSelect';
import Desc from './UploadFile/Desc';
import FormItemRender, {
  MetaCode2CodeMap,
  Code2MetaCodeMap,
  MetaCode2AliasMap,
  Alias2MetaCodeMap,
  MetaCodeList,
  DateMetaCodeList,
} from './FormItemRender';
import { colsNumConfig, getUtc8Time, getMetaCodeKey } from './formConfig';
import { Title, DescWrapper, FormGroupBox, FormGroupItemBox } from './style';

const { useForm } = Form;
// 埋点开关
let isCanSubmitSensorsEdit = true;

export default ({
  onNextPage,
  onPrePage,
  pageTitle,
  componentGroups = [],
  pageAfterApi,
  pageId,
  pageElements,
  errMsg,
  pageCode,
}) => {
  const { isSmStyle, onCacheFormData, formData, flowData, hideFormFooterPreBtn } = useCommonData();
  const { message } = useSnackbar();
  const [form] = useForm();
  const { validateFields, setFieldsValue, setFields } = form;
  const contentBoxRef = useRef(null);
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [serviceErrCode, setServiceErrCode] = useState(null);
  // 当前表单值
  const [curFormValue, setCurFormValue] = useState({});
  // 联动数据
  const [relationState, setRelationState] = useState({
    // 联动1 默认要显示的组件
    relationDefaultShowList: [],
    // 联动1 要隐藏的组件
    relationHideMetaCodeList: [],
    // 联动3 默认要隐藏的组件
    relationDefaultHideList: [],
    // 联动3 要显示的组件
    relationShowMetaCodeList: [],
    // 联动4 desc
    relationDescMap: {},
    // 联动5 Input变Select的组件列表
    relationInputToSelectList: [],
  });

  useEffect(() => {
    onRelations({ curMetaCode: null, allV: formData });
    setCurFormValue({});
    // 页面浏览埋点
    const blockId = kcsensorsBlockidMap[pageCode];
    if (blockId) {
      isCanSubmitSensorsEdit = true;
      kcsensorsClick([blockId, '1'], {
        kyc_standard: flowData.complianceStandardAlias,
      });
    }
    if (contentBoxRef.current) {
      contentBoxRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pageCode]);

  // 处理表单数据
  const onDealData = (values) => {
    const baseData = {};
    const params = {};
    const extraData = {};

    Object.keys(values).forEach((key) => {
      const val = values[key];
      baseData[key] = val;
      if (MetaCode2CodeMap[key]) {
        baseData[MetaCode2CodeMap[key]] = val;
      }
      if (MetaCode2AliasMap[key]) {
        baseData[MetaCode2AliasMap[key]] = val;
      }

      if (val) {
        // 提交处理参数
        if (DateMetaCodeList.includes(key)) {
          params[key] = getUtc8Time(val);
        } else if (MetaCodeList.includes(key)) {
          params[key] = isString(val) ? val?.trim() : val;
        }
        // 电话号码特殊处理拼区号
        if (key === PHONE_CODE) {
          params[Code2MetaCodeMap[key]] = `${values.phoneArea}-${val}`;
        }
        // 证件到期日特殊处理
        if (key === EXPIRY_DATE_CODE) {
          const type = formData[expiryDateTypeKey];
          if (type === expiryDateType2) {
            params[Code2MetaCodeMap[key]] = MAX_DATE_VAL;
          } else {
            params[Code2MetaCodeMap[key]] = getUtc8Time(val);
          }
        }
        // 上传文件数据处理
        if (val?.[0]?.key) {
          params[key] = val?.map((i) => i.key)?.join(',');
        }
        if (isEmpty(val)) {
          params[key] = '';
        }

        // 缓存componentCode的映射值
        if (MetaCode2CodeMap[key]) {
          extraData[MetaCode2CodeMap[key]] = val;
        }
        if (MetaCode2AliasMap[key]) {
          extraData[MetaCode2AliasMap[key]] = params[key];
        }
      }
    });

    onCacheFormData({ ...params, ...baseData, ...extraData });

    return {
      params,
    };
  };

  // 处理数据联动
  const onRelations = ({ curMetaCode, allV }) => {
    const componentRelations = flowData?.componentRelations || [];
    // 表单change触发元素没在联动关系里
    if (
      curMetaCode &&
      !componentRelations.some((relationItem) =>
        relationItem?.trigger?.some((i) => getMetaCodeKey(i) === curMetaCode),
      )
    ) {
      return false;
    }

    let defaultShowList = [];
    let newHideList = [];
    let defaultHideList = [];
    let newShowList = [];
    const newDescMap = cloneDeep(relationState.relationDescMap);
    let newInputToSelectList = [];

    componentRelations.forEach((relationItem) => {
      const { relationType, trigger, affected } = relationItem;
      /**
       * 控制组件隐藏
       * 输入值等于trigger值时，隐藏affected的组件
       * affected的组件默认显示
       */
      if (relationType === 1) {
        const metaCodeList = affected.map((i) => getMetaCodeKey(i));
        defaultShowList = [...defaultShowList, ...metaCodeList];
        if (
          trigger.every(
            (i) =>
              i.metaData === allV[getMetaCodeKey(i)] || (!i.metaData && !allV[getMetaCodeKey(i)]),
          )
        ) {
          newHideList = [...new Set([...newHideList, ...metaCodeList])];
        }
      }
      /**
       * 控制组件显示
       * 输入值等于trigger值时，显示affected的组件
       * affected的组件默认隐藏
       */
      if (relationType === 3) {
        const metaCodeList = affected.map((i) => getMetaCodeKey(i));
        defaultHideList = [...defaultHideList, ...metaCodeList];
        if (
          trigger.every(
            (i) =>
              i.metaData === allV[getMetaCodeKey(i)] || (!i.metaData && !allV[getMetaCodeKey(i)]),
          )
        ) {
          newShowList = [...new Set([...newShowList, ...metaCodeList])];
        }
      }
      /**
       * 控制组件输入类型，组件A的值为xxx时，组件B,C,D变为Select
       * affected的组件默认Input
       */
      if (relationType === 5) {
        const metaCodeList = affected.map((i) => getMetaCodeKey(i));

        if (
          trigger.every(
            (i) =>
              i.metaData === allV[getMetaCodeKey(i)] || (!i.metaData && !allV[getMetaCodeKey(i)]),
          )
        ) {
          newInputToSelectList = [...new Set([...newInputToSelectList, ...metaCodeList])];
        }
      }
      /**
       * componentGroupDesc联动
       * trigger某一项的affectedElementList的metaData等于用户输入，
       * affected的groupId 映射 affectedElementItem?.componentGroupDesc
       */
      if (relationType === 4) {
        trigger.forEach((triggerItem) => {
          const affectedElementItem = triggerItem?.affectedElementList?.find(
            (i) => i.metaData === allV[getMetaCodeKey(triggerItem)],
          );
          if (affectedElementItem) {
            affected.forEach(({ groupId }) => {
              if (groupId) {
                newDescMap[groupId] = affectedElementItem?.componentGroupDesc;
              }
            });
          }
        });
      }
    });

    setRelationState((pre) => {
      return {
        ...pre,
        // 只有初始化调用才设置default
        ...(curMetaCode
          ? {}
          : {
              relationDefaultShowList: defaultShowList,
              relationDefaultHideList: defaultHideList,
            }),
        relationHideMetaCodeList: newHideList,
        relationShowMetaCodeList: newShowList,
        relationDescMap: newDescMap,
        relationInputToSelectList: newInputToSelectList,
      };
    });
  };

  // 表单值变化回调
  const onHandleChangeValue = (values, allV) => {
    const metaCode = Object.keys(values)[0];
    // 选择发证国家重置证件类型
    if ([ISSUE_COUNTRY_ALIAS, ISSUE_COUNTRY_2_ALIAS].includes(MetaCode2AliasMap[metaCode])) {
      setFieldsValue({
        [Alias2MetaCodeMap[ID_TYPE_ALIAS]]: '',
        [Alias2MetaCodeMap[ID_TYPE_2_ALIAS]]: '',
      });
    }

    // 处理联动
    onRelations({ curMetaCode: metaCode, allV: { ...formData, ...allV }, isType2Open: true });

    // 清空后端返回错误msg
    if (serviceErrCode) {
      setFields([
        {
          name: serviceErrCode,
          errors: [],
        },
        {
          name: MetaCode2CodeMap[serviceErrCode],
          errors: [],
        },
      ]);
      setServiceErrCode(null);
    }

    // 埋点
    const blockId = kcsensorsBlockidMap[pageCode];
    if (blockId && isCanSubmitSensorsEdit) {
      isCanSubmitSensorsEdit = false;
      kcsensorsClick([`${blockId}_Edit`, '1'], {
        kyc_standard: flowData.complianceStandardAlias,
        alias: MetaCode2AliasMap[metaCode],
      });
    }
  };

  // 提交
  const handleSubmit = () => {
    const blockId = kcsensorsBlockidMap[pageCode];
    if (blockId) {
      kcsensorsClick([`${blockId}_Next`, '1'], { kyc_standard: flowData.complianceStandardAlias });
    }

    if (errMsg) {
      message.error(errMsg);
      return;
    }

    validateFields()
      .then(async (values) => {
        setLoadingSubmit(true);
        try {
          const { params } = onDealData(values);

          const metaMap = cloneDeep(params);

          // 值联动组件 隐藏 的时候值采用trigger的值
          flowData?.componentRelations?.forEach((relationItem) => {
            const { relationType, trigger, affected } = relationItem;
            if (relationType === 2) {
              const triggerMetaCode = getMetaCodeKey(trigger[0]);
              const affectedMetaCode = affected[0].metaCode;
              if (
                relationState.relationHideMetaCodeList.includes(affectedMetaCode) &&
                metaMap[triggerMetaCode]
              ) {
                metaMap[affectedMetaCode] = metaMap[triggerMetaCode];
              }
            }
          });

          const { flowId, transactionId, complianceStandardCode } = flowData;
          await postJsonWithPrefix(pageAfterApi, {
            flowId,
            transactionId,
            complianceStandardCode,
            pageId,
            metaMap,
          });
          onNextPage();
        } catch (error) {
          const { msg, code } = error;
          if (msg) {
            const inputCode = code?.split('-')?.[1];
            if (inputCode) {
              setServiceErrCode(inputCode);
              setFields([
                {
                  name: inputCode,
                  errors: [msg],
                },
                {
                  name: MetaCode2CodeMap[inputCode],
                  errors: [msg],
                },
              ]);

              try {
                const el =
                  document.querySelector(`[data-compliancemetacode="${inputCode}"]`) ||
                  document.querySelector(`[data-componentcode="${MetaCode2CodeMap[inputCode]}"]`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              } catch (error) {
                console.error(error);
              }

              message.error(msg);
            } else {
              message.error(msg);
            }
          }
        }
        setLoadingSubmit(false);
      })
      .catch((errorInfo) => {
        console.error('errorInfo === ', errorInfo);
        if (errorInfo?.errorFields?.length > 0) {
          const el = document.querySelector(
            `[data-compliancemetacode="${errorInfo.errorFields[0]?.name?.[0]}"]`,
          );
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
  };

  return (
    <Wrapper>
      <ContentBox
        ref={contentBoxRef}
        needPt
        className={classnames({
          isSmStyle,
          formContentBox: true,
        })}
      >
        {isSmStyle && <Title>{pageTitle || pageElements?.pageTitle}</Title>}
        {pageElements?.pageDescription ? (
          <DescWrapper>
            <Desc desc={pageElements?.pageDescription} ignoreBoxMb />
          </DescWrapper>
        ) : null}

        <Form
          form={form}
          onValuesChange={(changedValues, allValues) => {
            setCurFormValue(allValues);
            onHandleChangeValue(changedValues, allValues);
            onDealData(allValues);
          }}
          style={{ marginTop: isSmStyle ? '24px' : 0 }}
        >
          {componentGroups.map((groupItem) => {
            const {
              componentGroupId,
              componentGroupTitle,
              componentGroupDesc,
              components,
              componentGroupTemplateCode,
            } = groupItem;

            // 组件包的 uiConfig
            const uiConfig = getJsonStringToObj(groupItem.uiConfig);

            const itemUseGroupProps = {
              ...relationState,
              form,
              pageId,
              componentGroupId,
              componentGroupTitle,
              componentGroupDesc:
                relationState.relationDescMap[componentGroupId] || componentGroupDesc,
              curFormValue,
            };

            // 是否一行一个
            const isRow1Col1 = colsNumConfig[componentGroupTemplateCode] === 1;

            return (
              <FormGroupBox
                className={classnames({
                  isSmStyle,
                  FormGroupBox: true,
                  FormGroupBoxBorder: uiConfig.hasBorder,
                })}
                key={componentGroupId}
              >
                {components.map((componentItem, index) => {
                  const { complianceMetaCode } = componentItem;
                  return (
                    <FormGroupItemBox
                      className={classnames({
                        isSmStyle,
                        ml16: index > 0 && !isRow1Col1,
                      })}
                      style={{
                        flexBasis: `calc(${100 /
                          (colsNumConfig[componentGroupTemplateCode] || 1)}% - 16px)`,
                      }}
                      key={complianceMetaCode}
                    >
                      <FormItemRender
                        {...itemUseGroupProps}
                        componentItem={componentItem}
                        key={complianceMetaCode}
                      />
                    </FormGroupItemBox>
                  );
                })}
              </FormGroupBox>
            );
          })}
        </Form>
      </ContentBox>

      {/* 底部按钮 */}
      <FooterBtnBox
        onNext={handleSubmit}
        onPre={onPrePage}
        preText={hideFormFooterPreBtn ? null : pageElements?.pagePreButtonTxt}
        nextText={pageElements?.pageNextButtonTxt}
        isNextLoading={isLoadingSubmit}
      />
    </Wrapper>
  );
};
