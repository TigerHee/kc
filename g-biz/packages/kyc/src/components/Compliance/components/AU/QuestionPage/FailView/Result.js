/**
 * Owner: tiger@kupotech.com
 */
import { useMemo } from 'react';
import classnames from 'classnames';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { Wrapper, ContentBox, FooterBtnBox } from '@kycCompliance/components/commonStyle';
import { ResultContent, StatusTagWrapper, ErrorIcon, SuccessIcon } from './style';

const StatusTag = ({ isSuccess }) => {
  const { _t } = useLang();

  return (
    <StatusTagWrapper isSuccess={isSuccess}>
      {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
      <b>{isSuccess ? _t('a0e10944d6314800a022') : _t('990c251f78e74800a49d')}</b>
    </StatusTagWrapper>
  );
};

export default ({ isSmStyle, questions, qIndex, setQIndex, questionnaire, onClose }) => {
  const { _t } = useLang();

  const { selectData = {}, correctAnswersMap = {} } = questionnaire;
  // 当前题目
  const curQuestion = useMemo(() => questions[qIndex] || {}, [qIndex, questions]);
  // 问题总数
  const totalQuestionNum = questions?.length ?? 0;
  // 是否在最后一题
  const isInLastQuestion = qIndex === totalQuestionNum - 1;
  // 是否多选
  const isCheckboxType = curQuestion.questionType === '2';
  // 用户选的答案
  const userOptionIds = useMemo(() => selectData[curQuestion.id] || [], [
    selectData,
    curQuestion.id,
  ]);
  /// 正确答案
  const correctOptionIds = useMemo(() => correctAnswersMap[curQuestion.id] || [], [
    correctAnswersMap,
    curQuestion.id,
  ]);

  return (
    <Wrapper>
      <ContentBox
        className={classnames({
          isSmStyle,
        })}
      >
        <ResultContent
          className={classnames({
            isSmStyle,
          })}
        >
          <div className="top">
            <div className="ratio">
              {_t('90676067a0b14000abbb', { numerator: qIndex + 1, denominator: totalQuestionNum })}
            </div>
            <div className="title">{curQuestion.title}</div>
            <div className="tip">
              {isCheckboxType ? _t('8c9c77ece62e4800adf3') : _t('5b852d7b8fe64000a74f')}
            </div>
            <div className="answerBox">
              {curQuestion.options?.map(({ title, optionId }) => {
                const isError =
                  userOptionIds.includes(optionId) && !correctOptionIds.includes(optionId);
                const isSuccess = correctOptionIds.includes(optionId);

                return (
                  <div
                    className={classnames({
                      answer: true,
                      answerError: isError,
                      answerSuccess: isSuccess,
                    })}
                    key={optionId}
                  >
                    <span>{title}</span>
                    {isError || isSuccess ? <StatusTag isSuccess={isSuccess} /> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </ResultContent>
      </ContentBox>

      <FooterBtnBox
        onNext={() => setQIndex((pre) => pre + 1)}
        onPre={() => {
          if (qIndex <= 0) {
            onClose();
            return;
          }
          setQIndex((pre) => pre - 1);
        }}
        preText={_t('kyc_process_previous')}
        nextText={isInLastQuestion ? null : _t('cf518b03b4e94800a916')}
      />
    </Wrapper>
  );
};
