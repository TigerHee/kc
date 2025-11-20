/**
 * Owner: tiger@kupotech.com
 * 问卷
 */
import { Fragment, useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import loadable from '@loadable/component';
import { isEmpty, isEqual, debounce } from 'lodash';
import { Form, Input, Checkbox, Radio, useSnackbar } from '@kux/mui';
import { kcsensorsClick } from '@packages/kyc/src/common/tools';
import { Wrapper, ContentBox, FooterBtnBox } from '../commonStyle';
import useCommonData from '../../hooks/useCommonData';
import { Question, RadioItem, CheckboxItem, Title, DescWrapper, StyledSpin } from './style';
import { fetchQuestionResult, postJsonWithPrefix, getQuestionData } from '../../service';
import useFetch from '../../hooks/useFetch';
import useLang from '../../../../hookTool/useLang';
import Desc from '../FormPage/UploadFile/Desc';
import { kcsensorsBlockidMap } from '../../config';

const ScoreResult = loadable(() => import('./ScoreResult'));

const { FormItem, useForm } = Form;
// const inputItemSuffix = '_input_suffix';

export default ({
  onNextPage,
  onPrePage,
  pageTitle,
  pageAfterApi,
  pageId,
  complianceMetaCodes,
  pageCode,
}) => {
  const { _t } = useLang();
  const [form] = useForm();
  const { message } = useSnackbar();
  const { isSmStyle, flowData, setInnerPageElements, scoreStep, setScoreStep } = useCommonData();
  const { validateFields, resetFields } = form;

  // 按钮loading
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  // 表单数据
  const [allValues, setAllValues] = useState({});
  // 评分
  const [score, setScore] = useState(0);
  const [isResultChecked, setResultChecked] = useState(false);

  // 获取问卷
  const { data, loading, onFetchData } = useFetch(getQuestionData, {
    autoFetch: false,
  });
  const { pageElements = {}, questions = [], questionnaireType } = data;

  useEffect(() => {
    // 页面浏览埋点
    const blockId = kcsensorsBlockidMap[pageCode];
    if (blockId) {
      kcsensorsClick([blockId, '1'], {
        kyc_standard: flowData.complianceStandardAlias,
      });
    }
  }, [pageCode]);

  // complianceMetaCodes变化重新拉取问卷
  useEffect(() => {
    setScoreStep(1);
    setAllValues({});
    setScore(0);
    resetFields();

    onFetchData({
      complianceStandardCode: flowData?.complianceStandardCode,
      metaCode: complianceMetaCodes[0],
    });
  }, [complianceMetaCodes, flowData?.complianceStandardCode]);

  // 设置innerPageElements，顶部返回按钮要用
  useEffect(() => {
    setInnerPageElements(pageElements);
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

  // 是否记分问卷
  const isScoreType = useMemo(() => questionnaireType === 1, [questionnaireType]);
  // 是否展示答题表单
  const isShowQuestionForm = useMemo(() => !isScoreType || (isScoreType && scoreStep === 1), [
    isScoreType,
    scoreStep,
  ]);
  // 问题总数
  const totalQuestionNum = useMemo(() => questions?.length, [questions]);
  // 已回答问题数
  const completeQuestionNum = useMemo(
    () =>
      Object.keys(allValues).filter((k) => {
        const v = allValues[k];
        if (!isScoreType) {
          // 答题问卷选到正确答案才算完成
          const questionItem = questions?.find((i) => i.id === k);
          const { isRadio, isCheckbox } = getItemType(questionItem?.questionType);
          if (isRadio) {
            return !isEmpty(v) && questionItem?.answerOptionId?.includes(v);
          }
          if (isCheckbox) {
            return !isEmpty(v) && isEqual(v?.sort(), questionItem?.answerOptionId?.sort());
          }
          return false;
        }
        return !isEmpty(v);
      })?.length,
    [allValues, isScoreType, questions],
  );
  // 评分等级规则
  const levels = useMemo(() => data.levels || [], [data.levels]);
  // 下一步按钮文案
  const nextText = useMemo(() => {
    if (isShowQuestionForm) {
      return `${_t('f14ecdf869994000ab89')} (${completeQuestionNum}/${totalQuestionNum})`;
    }
    return pageElements?.pageNextButtonTxt;
  }, [
    pageElements?.pageNextButtonTxt,
    isShowQuestionForm,
    totalQuestionNum,
    completeQuestionNum,
    _t,
  ]);
  // 下一步按钮是否disabled
  const isNextBtnDisable = useMemo(() => {
    if (isShowQuestionForm) {
      return completeQuestionNum !== totalQuestionNum;
    }
    // 结果页必须check
    if (isScoreType && scoreStep === 2 && !isResultChecked) {
      return true;
    }

    return false;
  }, [
    isShowQuestionForm,
    completeQuestionNum,
    totalQuestionNum,
    isResultChecked,
    isScoreType,
    scoreStep,
  ]);
  // 当前等级index
  const curLevelIndex = useMemo(
    () =>
      levels.findIndex(
        ({ range }) => (score - range[0] >= 0 || !range[0]) && (score - range[1] <= 0 || !range[1]),
      ),
    [score, levels],
  );
  // 当前等级数据
  const curLevelItem = useMemo(() => levels[curLevelIndex], [curLevelIndex, levels]);

  // 组装答案
  const getAnswers = (v) => {
    const values = v || allValues;
    const answersObj = {};
    Object.keys(values).forEach((questionId) => {
      const v = values[questionId];
      answersObj[questionId] = String(v);
    });
    return answersObj;
  };

  // 提交metaData
  const onNext = async () => {
    try {
      const { flowId, transactionId, complianceStandardCode } = flowData;
      const metaData = {
        answers: getAnswers(),
      };

      if (score && isScoreType) {
        metaData.score = score;
        metaData.level = {
          'id': curLevelItem?.id,
          'name': curLevelItem?.name,
        };
      }

      await postJsonWithPrefix(pageAfterApi, {
        flowId,
        transactionId,
        complianceStandardCode,
        pageId,
        metaMap: { [complianceMetaCodes[0]]: JSON.stringify(metaData) },
      });
      setLoadingSubmit(false);

      onNextPage();
    } catch (error) {
      setLoadingSubmit(false);
      if (error?.msg) {
        message.error(error?.msg);
      }
    }
  };

  const onSensorsNext = (blockId) => {
    kcsensorsClick([`${blockId}_Next`, '1'], {
      kyc_standard: flowData.complianceStandardAlias,
    });
  };

  // 点击提交
  const onHandleSubmit = debounce(() => {
    setLoadingSubmit(true);
    let blockId = kcsensorsBlockidMap[pageCode];
    if (isScoreType) {
      if (scoreStep === 1) {
        validateFields().then((values) => {
          const params = {
            complianceStandardCode: flowData?.complianceStandardCode,
            answers: getAnswers(values),
            metaCode: complianceMetaCodes[0],
          };

          fetchQuestionResult(params)
            .then((res) => {
              if (res.success) {
                setScoreStep(2);
                setScore(res.data.score);
              }
            })
            .finally(() => {
              setLoadingSubmit(false);
            });
        });
        onSensorsNext(blockId);
        return false;
      }
      blockId = kcsensorsBlockidMap.page_14_result;
      onSensorsNext(blockId);
      onNext();
      return false;
    }
    onSensorsNext(blockId);
    onNext();
  }, 200);

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="large" />
      {/* 问卷 */}
      {isShowQuestionForm && !loading ? (
        <ContentBox
          className={classnames({
            isSmStyle,
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
            onValuesChange={(changedV, allV) => {
              setAllValues(allV);
            }}
          >
            {questions.map((item) => {
              const { id, title, questionType, options, answerOptionId } = item;
              const { isRadio, isInput, isCheckbox } = getItemType(questionType);
              const userSelectOptionId = allValues[id];

              const QuestionTitle = (
                <Question id={id}>
                  {id}. {title}
                </Question>
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
                          message: _t('mR67a17ZzFE7hFLdM9tJvJ'),
                        },
                      ]}
                      label=""
                    >
                      <Radio.Group size="small">
                        {options.map(({ title: label, optionId }) => {
                          const isGreen =
                            !isScoreType && userSelectOptionId && answerOptionId.includes(optionId);
                          const isRed =
                            !isScoreType &&
                            userSelectOptionId &&
                            userSelectOptionId === optionId &&
                            !answerOptionId.includes(optionId);

                          return (
                            <RadioItem
                              key={optionId}
                              className={classnames({
                                isGreen,
                                isRed,
                              })}
                            >
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
                          message: _t('mR67a17ZzFE7hFLdM9tJvJ'),
                        },
                      ]}
                    >
                      <Checkbox.Group size="small">
                        {options.map(({ title: label, optionId }) => {
                          const isGreen =
                            !isScoreType &&
                            userSelectOptionId?.length &&
                            answerOptionId.includes(optionId);
                          const isRed =
                            !isScoreType &&
                            userSelectOptionId?.length &&
                            userSelectOptionId.includes(optionId) &&
                            !answerOptionId.includes(optionId);

                          return (
                            <CheckboxItem
                              key={optionId}
                              className={classnames({
                                isGreen,
                                isRed,
                              })}
                            >
                              <Checkbox value={optionId} key={optionId} size="large">
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
        </ContentBox>
      ) : null}

      {/* 显示得分结果 */}
      {isScoreType && scoreStep === 2 ? (
        <ContentBox
          className={classnames({
            isSmStyle,
          })}
        >
          <ScoreResult
            curLevelIndex={curLevelIndex}
            curLevelItem={curLevelItem}
            setResultChecked={setResultChecked}
          />
        </ContentBox>
      ) : null}

      {/* 底部按钮 */}
      {questions.length > 0 && !loading ? (
        <FooterBtnBox
          onNext={onHandleSubmit}
          onPre={onPrePage}
          preText={pageElements?.pagePreButtonTxt}
          nextText={nextText}
          isNextLoading={isLoadingSubmit}
          nextBtnProps={{
            disabled: isNextBtnDisable,
          }}
        />
      ) : null}
    </Wrapper>
  );
};
