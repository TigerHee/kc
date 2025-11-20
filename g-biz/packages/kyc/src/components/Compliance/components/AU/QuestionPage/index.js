/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useCallback, useMemo, useState, Fragment } from 'react';
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
import { Parser } from 'html-to-react';
import { Input, useSnackbar } from '@kux/mui';
import storage from '@utils/storage';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { getJsonStringToObj } from '@kycCompliance/config';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import {
  Wrapper,
  ContentBox,
  FooterBtnBox,
  StyledSpin,
} from '@kycCompliance/components/commonStyle';
import {
  postJsonWithPrefix,
  getInitDataCommon,
  getQuestionnaireLookup,
  postQuestionnaireEvaluate,
} from '@kycCompliance/service';
import useFetch from '@kycCompliance/hooks/useFetch';
import CommonSelect from '@kycCompliance/components/FormPage/CommonSelect';
import { QuestionContent, CheckBoxSelectIcon, RadioSelectIcon, UnSelectIcon } from './style';
import ConfirmModal from './ConfirmModal';
import FailView from './FailView';
import { getSelectOptions } from './config';

const htmlToReactParser = new Parser();

const INPUT_PREFIX = 'F#';

export default ({ onPrePage, pageCode, pageAfterApi, pageId, complianceMetaCodes, onNextPage }) => {
  const { _t } = useLang();
  const { message } = useSnackbar();
  const { isSmStyle, setInnerPageElements, setCrossPageData, flowData, formData } = useCommonData();
  // 问题 index
  const [qIndex, setQIndex] = useState(0);
  // 用户选择的答案
  const [selectData, setSelectData] = useState({});
  // 用户输入的信息
  const [inputData, setInputData] = useState({});
  // 是否显示提交弹窗
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  // 提交 loading
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  // 展示失败界面
  const [isShowFailView, setShowFailView] = useState(false);

  // 获取 page 配置
  const { data: pageData } = useFetch(getInitDataCommon, { params: { pageCode }, ready: pageCode });
  // 获取问卷数据
  const { data, loading, onFetchData } = useFetch(getQuestionnaireLookup, {
    autoFetch: false,
  });

  // 拉取问卷
  const getQuestionnaireData = () => {
    if (pageData?.pageElements?.questionnaireCode) {
      onFetchData({
        questionnaireCode: pageData?.pageElements?.questionnaireCode,
      });

      setQIndex(0);
      try {
        // 是否开启问卷回填
        const questionnaireBackFill = flowData?.settings?.questionnaireBackFill;
        const metaCode = complianceMetaCodes[0];
        if (questionnaireBackFill && formData[metaCode]) {
          const data = getJsonStringToObj(formData[metaCode]);
          const selectDataInit = {};
          data?.answer?.forEach(({ questionId, selectedOptions }) => {
            selectDataInit[questionId] = selectedOptions.filter((i) => !i.includes(INPUT_PREFIX));
          });
          setSelectData(selectDataInit);
        } else {
          const storageData = storage.getItem(metaCode);
          if (questionnaireBackFill && storageData) {
            setSelectData(storageData?.selectData || {});
            setInputData(storageData?.inputData || {});
          } else {
            setSelectData({});
            setInputData({});
          }
        }
      } catch (error) {
        setSelectData({});
        setInputData({});
      }
    }
  };

  useEffect(() => {
    getQuestionnaireData();
  }, [pageData?.pageElements?.questionnaireCode]);

  // 问卷配置
  const questionnaireConfig = useMemo(() => {
    const config = data.questionnaireConfig ? JSON.parse(data.questionnaireConfig) : {};
    return { ...config, requiredCorrects: data.requiredCorrects };
  }, [data.questionnaireConfig, data.requiredCorrects]);
  // 问题列表
  const questions = useMemo(() => data?.questions || [], [data]);
  // 当前题目
  const curQuestion = useMemo(() => questions[qIndex] || {}, [qIndex, questions]);
  // 问题总数
  const totalQuestionNum = questions?.length ?? 0;
  // 是否在最后一题
  const isInLastQuestion = qIndex === totalQuestionNum - 1;
  // 是否多选
  const isCheckboxType = curQuestion.questionType === '2';
  // 是否多选
  const isSelectType = curQuestion.questionType === '1' && curQuestion.optionsRenderType === '2';
  // 选中有输入框的选项
  const withInputOptionItem = useMemo(() => curQuestion.options?.find((i) => i.withInput), [
    curQuestion,
  ]);

  // 提交
  const onSubmit = () => {
    const metaCode = complianceMetaCodes[0];
    if (isInLastQuestion) {
      if (!isConfirmModalOpen && questionnaireConfig.remindBeforeSubmitting) {
        setConfirmModalOpen(true);
        return;
      }

      const answers = Object.keys(selectData).map((questionId) => {
        const selectedOptions = cloneDeep(selectData[questionId]);
        selectData[questionId]?.forEach((optionId) => {
          const v = inputData[`${questionId}-${optionId}`];
          const inputV = v ? `${INPUT_PREFIX}${v}` : null;
          if (inputV) {
            const index = selectedOptions.indexOf(optionId);
            selectedOptions.splice(index + 1, 0, inputV);
          }
        });

        return {
          questionId,
          selectedOptions,
        };
      });

      setSubmitLoading(true);
      postQuestionnaireEvaluate({
        questionnaireCode: pageData?.pageElements?.questionnaireCode,
        answers,
      })
        .then(async (res) => {
          if (res.success) {
            const data = res.data || {};
            setCrossPageData((pre) => {
              return {
                ...pre,
                ...{ questionnaire: { ...data, ...questionnaireConfig, selectData } },
              };
            });

            try {
              const { flowId, transactionId, complianceStandardCode } = flowData;
              const metaMapVal = {
                answer: answers,
                result: data.pass ? 'PASS' : 'FAILED',
                questionnaireCode: pageData?.pageElements?.questionnaireCode,
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
                  [metaCode]: JSON.stringify(metaMapVal),
                },
              });
            } catch (error) {
              if (error?.msg) {
                message.error(error?.msg);
                return;
              }
            }

            if (!data.pass) {
              setShowFailView(true);
            } else {
              onNextPage();
            }
          }
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    } else {
      setQIndex((pre) => pre + 1);
      storage.setItem(metaCode, { selectData, inputData });
    }
  };

  // 处理用户选择
  const onHandleSelectData = (v) => {
    const id = curQuestion?.id;
    let val = selectData[id] || [];
    if (isCheckboxType) {
      if (val.includes(v)) {
        val = val.filter((i) => i !== v);
      } else {
        val = [...val, v];
      }
    } else {
      val = [v];
    }

    setSelectData((pre) => {
      return { ...pre, ...{ [id]: val } };
    });

    // if (!isInLastQuestion && !isCheckboxType) {
    //   setQIndex((pre) => pre + 1);
    // }
  };

  // 上一步
  const onPre = useCallback(() => {
    if (qIndex === 0) {
      onPrePage();
      return;
    }

    setQIndex((pre) => pre - 1);
  }, [qIndex]);

  useEffect(() => {
    setInnerPageElements({
      ...pageData?.pageElements,
      onHeaderLeft: onPre,
    });
  }, [onPre, pageData?.pageElements]);

  // 下一步是否禁用
  const isNextDisabled = useMemo(() => {
    const selected = selectData[curQuestion.id];
    if (!selected || selected.length === 0) return true;

    const withInputOption = curQuestion.options?.find((i) => i.withInput);
    if (withInputOption && selected.includes(withInputOption.optionId)) {
      const key = `${curQuestion.id}-${withInputOption.optionId}`;
      const inputVal = inputData[key];
      if (!inputVal?.trim()) return true; // 必填但没填
    }

    return false;
  }, [selectData, inputData, curQuestion]);

  return isShowFailView ? (
    <FailView questions={questions} pageElements={pageData?.pageElements} />
  ) : (
    <Wrapper>
      <StyledSpin spinning={loading} size="large" />

      {totalQuestionNum > 0 ? (
        <ContentBox
          className={classnames({
            isSmStyle,
          })}
        >
          <QuestionContent
            className={classnames({
              isSmStyle,
            })}
          >
            <div className="ratio">
              {_t('90676067a0b14000abbb', { numerator: qIndex + 1, denominator: totalQuestionNum })}
            </div>
            <h3 className="title">{curQuestion.title}</h3>
            {curQuestion.titleSub ? (
              <div className="desc">{htmlToReactParser.parse(curQuestion.titleSub)}</div>
            ) : null}
            <div className="tip">
              {isCheckboxType ? _t('8c9c77ece62e4800adf3') : _t('5b852d7b8fe64000a74f')}
            </div>

            {/* 下拉 */}
            {isSelectType && (
              <div className="answerBox">
                <CommonSelect
                  value={selectData?.[curQuestion.id]?.[0] || ''}
                  onChange={(v) => onHandleSelectData(v)}
                  options={getSelectOptions(curQuestion.options || [])}
                  placeholder={curQuestion.title}
                />
                {withInputOptionItem &&
                selectData[curQuestion.id]?.includes(withInputOptionItem.optionId) ? (
                  <div className="inputBox">
                    <Input
                      onChange={(e) => {
                        setInputData((pre) => {
                          return {
                            ...pre,
                            ...{
                              [`${curQuestion.id}-${withInputOptionItem.optionId}`]: e.target.value,
                            },
                          };
                        });
                      }}
                      value={inputData[`${curQuestion.id}-${withInputOptionItem.optionId}`] || ''}
                      label={withInputOptionItem.inputTitle}
                      size="xlarge"
                      labelProps={{ 'shrink': true }}
                    />
                  </div>
                ) : null}
              </div>
            )}

            {/* 单选 ｜ 复选 */}
            {!isSelectType && (
              <div className="answerBox">
                {curQuestion.options?.map(({ title, optionId, withInput, inputTitle }) => {
                  const isActive = selectData[curQuestion.id]?.includes(optionId);
                  const isShowInput = isActive && withInput;
                  const inputKey = `${curQuestion.id}-${optionId}`;

                  return (
                    <Fragment key={optionId}>
                      <div
                        onClick={() => onHandleSelectData(optionId)}
                        className={classnames({
                          answer: true,
                          answerActive: isActive,
                        })}
                      >
                        <span>{title}</span>
                        {isActive ? (
                          isCheckboxType ? (
                            <CheckBoxSelectIcon />
                          ) : (
                            <RadioSelectIcon />
                          )
                        ) : (
                          <UnSelectIcon />
                        )}
                      </div>

                      {isShowInput && (
                        <Input
                          onChange={(e) => {
                            setInputData((pre) => {
                              return { ...pre, ...{ [inputKey]: e.target.value } };
                            });
                          }}
                          value={inputData[inputKey] || ''}
                          label={inputTitle}
                          size="large"
                          labelProps={{ 'shrink': true }}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </QuestionContent>
        </ContentBox>
      ) : null}

      {loading ? null : (
        <FooterBtnBox
          onNext={onSubmit}
          isNextLoading={isSubmitLoading}
          onPre={onPre}
          preText={pageData?.pageElements?.pagePreButtonTxt}
          nextText={isInLastQuestion ? _t('380f04491a814800ac4b') : _t('cf518b03b4e94800a916')}
          nextBtnProps={{
            disabled: isNextDisabled,
          }}
        />
      )}

      {/* 提交弹窗 */}
      {isConfirmModalOpen && (
        <ConfirmModal
          open={isConfirmModalOpen}
          onCancel={() => {
            setConfirmModalOpen(false);
          }}
          onOk={() => {
            setConfirmModalOpen(false);
            onSubmit();
          }}
          questionnaireConfig={questionnaireConfig}
        />
      )}
    </Wrapper>
  );
};
