/**
 * Owner: tiger@kupotech.com
 * 问卷
 */
import { Fragment, useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import { isEmpty, isArray } from 'lodash';
import { Form, Input, Checkbox, Radio, useSnackbar } from '@kux/mui';
import { Wrapper, ContentBox, FooterBtnBox } from '@kycCompliance/components/commonStyle';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import {
  postJsonWithPrefix,
  getInitDataCommon,
  getQuestionnaireLookup,
  postQuestionnaireEvaluate,
} from '@kycCompliance/service';
import useFetch from '@kycCompliance/hooks/useFetch';
import useLang from '@packages/kyc/src/hookTool/useLang';
import {
  QuestionWrapper,
  Question,
  QuestionDesc,
  RadioItem,
  CheckboxItem,
  Title,
  StyledSpin,
} from './style';

const { FormItem, useForm } = Form;
// const inputItemSuffix = '_input_suffix';

export default ({ onPrePage, pageCode, pageAfterApi, pageId, complianceMetaCodes, onNextPage }) => {
  const { _t } = useLang();
  const [form] = useForm();
  const { message } = useSnackbar();

  const { isSmStyle, setInnerPageElements, flowData } = useCommonData();
  const { validateFields, resetFields } = form;

  // 按钮loading
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  // 表单数据
  const [allValues, setAllValues] = useState({});
  const [isOpenDisabled, setOpenDisabled] = useState(false);

  // 获取 page 配置
  const { data: pageData } = useFetch(getInitDataCommon, { params: { pageCode }, ready: pageCode });
  // 获取问卷数据
  const { data, loading, onFetchData } = useFetch(getQuestionnaireLookup, {
    autoFetch: false,
  });
  const pageElements = pageData?.pageElements || {};

  // 拉取问卷
  const getQuestionnaireData = () => {
    if (pageElements?.questionnaireCode) {
      resetFields();
      onFetchData({
        questionnaireCode: pageElements?.questionnaireCode,
      });
    }
  };

  useEffect(() => {
    getQuestionnaireData();
  }, [pageElements?.questionnaireCode]);

  useEffect(() => {
    setInnerPageElements({
      ...pageElements,
    });
  }, [pageElements]);

  // 获取题目的表单类型
  const getItemType = (questionType) => {
    const isRadio = questionType === '1';
    const isCheckbox = questionType === '2';
    const isInput = questionType === '3';
    return {
      isRadio,
      isCheckbox,
      isInput,
    };
  };

  // 问题列表
  const questions = useMemo(() => data?.questions || [], [data]);
  // 问题总数
  const totalQuestionNum = useMemo(() => questions?.length, [questions]);
  // 已回答问题数
  const completeQuestionNum = useMemo(
    () =>
      Object.keys(allValues).filter((k) => {
        const v = allValues[k];
        return !isEmpty(v);
      })?.length,
    [allValues, questions],
  );
  // 下一步按钮是否disabled
  const isNextBtnDisable = isOpenDisabled && completeQuestionNum !== totalQuestionNum;

  // 点击提交
  const onHandleSubmit = () => {
    setLoadingSubmit(false);
    setOpenDisabled(true);
    validateFields().then((values) => {
      const answers = Object.keys(values).map((questionId) => {
        const selectedOptions = values[questionId];
        return {
          questionId,
          selectedOptions: isArray(selectedOptions) ? selectedOptions : [selectedOptions],
        };
      });
      postQuestionnaireEvaluate({
        questionnaireCode: pageElements?.questionnaireCode,
        answers,
      })
        .then(async (res) => {
          if (res.success) {
            const data = res.data || {};

            try {
              const { flowId, transactionId, complianceStandardCode } = flowData;
              const metaMapVal = {
                answer: answers,
                result: data.pass ? 'PASS' : 'FAILED',
                questionnaireCode: pageElements?.questionnaireCode,
              };
              if (data.score) {
                metaMapVal.score = data.score;
              }

              await postJsonWithPrefix(pageAfterApi, {
                flowId,
                transactionId,
                complianceStandardCode,
                pageId,
                metaMap: {
                  [complianceMetaCodes[0]]: JSON.stringify(metaMapVal),
                },
              });
            } catch (error) {
              if (error?.msg) {
                message.error(error?.msg);
              }
            }

            onNextPage();
          }
        })
        .finally(() => {
          setLoadingSubmit(false);
        });
    });
  };

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="large" />
      {/* 问卷 */}
      {!loading ? (
        <ContentBox
          className={classnames({
            isSmStyle,
          })}
        >
          <QuestionWrapper>
            {isSmStyle && <Title>{pageElements?.pageTitle}</Title>}

            <Form
              form={form}
              onValuesChange={(changedV, allV) => {
                setAllValues(allV);
              }}
            >
              {questions.map((item) => {
                const { id, title, questionType, options } = item;
                const { isRadio, isInput, isCheckbox } = getItemType(questionType);

                const QuestionTitle = (
                  <>
                    <Question id={id}>
                      {id}. {title}
                    </Question>
                    {isRadio && <QuestionDesc>{_t('5b852d7b8fe64000a74f')}</QuestionDesc>}
                    {isCheckbox && <QuestionDesc>{_t('8c9c77ece62e4800adf3')}</QuestionDesc>}
                  </>
                );

                if (isRadio) {
                  return (
                    <Fragment key={id}>
                      {QuestionTitle}
                      <FormItem
                        name={id}
                        rules={[
                          {
                            required: true,
                            message: _t('04c95e4c14644000a2d8'),
                          },
                        ]}
                        label=""
                      >
                        <Radio.Group size="small">
                          {options.map(({ title: label, optionId }) => {
                            return (
                              <RadioItem key={optionId}>
                                <Radio value={optionId} key={optionId}>
                                  {optionId}. {label}
                                </Radio>
                                {/* {input && (
                      <FormItem label="" name={`${id}${inputItemSuffix}`}>
                        <Input
                          onInput={() => {
                            setFields([
                              {
                                name: id,
                                errors: '',
                              },
                            ]);
                          }}
                        />
                      </FormItem>
                    )} */}
                              </RadioItem>
                            );
                          })}
                        </Radio.Group>
                      </FormItem>
                    </Fragment>
                  );
                }

                if (isCheckbox) {
                  return (
                    <Fragment key={id}>
                      {QuestionTitle}
                      <FormItem
                        label=""
                        name={id}
                        rules={[
                          {
                            required: true,
                            message: _t('04c95e4c14644000a2d8'),
                          },
                        ]}
                      >
                        <Checkbox.Group size="small">
                          {options.map(({ title: label, optionId }) => {
                            return (
                              <CheckboxItem key={optionId}>
                                <Checkbox
                                  value={optionId}
                                  key={optionId}
                                  size="small"
                                  checkOptions={{
                                    type: 2, // 1黑色 2 灰色
                                    checkedType: 1, // 1黑色 2 绿色
                                  }}
                                >
                                  {optionId}. {label}
                                </Checkbox>
                                {/* {input && (
                      <FormItem label="" name={`${id}${inputItemSuffix}`}>
                        <Input />
                      </FormItem>
                    )} */}
                              </CheckboxItem>
                            );
                          })}
                        </Checkbox.Group>
                      </FormItem>
                    </Fragment>
                  );
                }

                if (isInput) {
                  return (
                    <Fragment key={id}>
                      {QuestionTitle}
                      <FormItem
                        label=""
                        name={id}
                        rules={[
                          {
                            required: true,
                            message: _t('mR67a17ZzFE7hFLdM9tJvJ'),
                          },
                        ]}
                      >
                        <Input />
                      </FormItem>
                    </Fragment>
                  );
                }
                return null;
              })}
            </Form>
          </QuestionWrapper>
        </ContentBox>
      ) : null}

      {/* 底部按钮 */}
      {questions.length > 0 && !loading ? (
        <FooterBtnBox
          onNext={onHandleSubmit}
          onPre={onPrePage}
          preText={pageElements?.pagePreButtonTxt}
          nextText={_t('3deb985d426a4000ab0d', {
            num1: completeQuestionNum,
            num2: totalQuestionNum,
          })}
          isNextLoading={isLoadingSubmit}
          nextBtnProps={{
            disabled: isNextBtnDisable,
          }}
        />
      ) : null}
    </Wrapper>
  );
};
