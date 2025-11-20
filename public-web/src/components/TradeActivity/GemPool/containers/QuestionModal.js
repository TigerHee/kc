/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-06-09 09:53:47
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-27 21:20:34
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/containers/QuestionModal.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Radio, Spin, styled } from '@kux/mui';
import numberFormat from '@kux/mui/utils/numberFormat';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import Modal from 'TradeActivityCommon/Modal';
import StatusModal, { EnumStatus } from 'TradeActivityCommon/StatusModal';

const CotentWrapper = styled.div`
  position: relative;
`;

const Loading = styled.div`
  padding: 150px 0px;
  text-align: center;
`;

const Spins = styled(Spin)`
  left: 50%;
  transform: translateX(-50%);
`;

const ButtonDivider = styled.div`
  position: fixed;
  width: 100%;
  bottom: 102px;
  border-bottom: 0.5px solid ${(props) => props.theme.colors.divider8};
  ${(props) => props.theme.breakpoints.up('sm')} {
    bottom: 87px;
    left: 0px;
  }
`;

const WarningOptions = styled.div`
  position: fixed;
  width: 100%;
  bottom: 102px;
  border-bottom: none;
  left: 0px;
  display: inline-flex;
  padding: 12px 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${(props) => props.theme.colors.complementary};
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  background-color: ${(props) => props.theme.colors.layer};
  ${(props) => props.theme.breakpoints.up('sm')} {
    bottom: 87px;
    border-bottom: 0.5px solid ${(props) => props.theme.colors.divider8};
  }
`;

const Container = styled.div`
  max-width: 600px;
  height: 466px;
  margin: 0 auto;
  padding-bottom: 40px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
`;

const QuestionContainer = styled.div`
  margin-bottom: 32px;
`;

const QuestionTitle = styled.div`
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

const AnswerOption = styled.div`
  display: block;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin-top: 16px;
  .KuxRadio-inner {
    width: 20px;
    height: 20px;
    border-color: ${(props) =>
      props.isError
        ? `${props.theme.colors.secondary}`
        : props.isSelected && `${props.theme.colors.primary}`};
    ::after {
      background-color: ${(props) =>
        props.isError
          ? `${props.theme.colors.secondary}`
          : props.isSelected && `${props.theme.colors.primary}`};
    }
  }
  .KuxRadio-text {
    color: ${(props) =>
      props.isError
        ? `${props.theme.colors.secondary}`
        : props.isSelected && `${props.theme.colors.primary}`};
  }
`;

const BottomContainer = styled.div`
  display: flex;
  padding: 24px 0px 16px 0px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px 0px;
  }

  gap: 10px;
  align-items: center;

  button {
    flex: 1;
    width: 50%;
  }
`;

const SubmitButton = styled(Button)`
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  cursor: pointer;
`;

const NoticeMessage = styled.div`
  display: flex;
  padding: 12px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
  margin-bottom: 24px;
  border-radius: 8px;
  margin-top: 16px;
  background: ${(props) => props.theme.colors.primary8};
  P {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 400;
    font-size: 14px;
    font-family: Roboto;
    font-style: normal;
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 0px;
  }
`;

export const QuizComponent = ({
  questions,
  handleQuestionClose,
  handleResultDialogVisible,
  handleBonusCoefficientValue,
  type,
  questionId,
}) => {
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const pullGemPoolExamLoading = useSelector(
    (state) => state.loading.effects['gempool/pullGemPoolExam'],
  );
  const postGemPoolExamSubmitLoading = useSelector(
    (state) => state.loading.effects['gempool/postGemPoolExamSubmit'],
  );

  const currentInfo = useSelector((state) => state.gempool.currentInfo, shallowEqual);
  const { campaignId, earnTokenName } = currentInfo || {}; // 详情页面才会用到

  const handleAnswerChange = useCallback((busId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [busId]: answer,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const payloadAnswers = Object.keys(answers).map((busId) => ({
      busId: busId,
      answer: answers[busId],
    }));
    const payload = {};
    payload.campaignId = questionId;
    payload.answers = payloadAnswers;
    try {
      dispatch({
        type: 'gempool/postGemPoolExamSubmit',
        payload: payload,
      }).then((data) => {
        const { result, results, bonusCoefficient } = data;

        if (result === 1) {
          //弹出弹框
          handleQuestionClose && handleQuestionClose();
          handleResultDialogVisible(true);
          handleBonusCoefficientValue(bonusCoefficient);
          // 答题成功更新页面数据
          if (type === 'detail') {
            // 详情页面更新详情接口与任务接口
            dispatch({
              type: 'gempool/pullGemPoolProjectDetail',
              payload: {
                currency: earnTokenName,
              },
            });

            // 获取任务列表及状态
            dispatch({
              type: 'gempool/pullGemPoolBonusTask',
              payload: {
                id: campaignId,
              },
            });
          } else {
            // 首页拉取list接口
            dispatch({
              type: 'gempool/pullGemPoolRecords',
            });
          }
        } else {
          const newErrors = {};
          results.forEach(({ busId, result }) => {
            if (result === 0) {
              newErrors[busId] = answers[busId];
            }
          });
          setErrors(newErrors);
        }
        setIsSubmitted(true);
      });
    } catch (error) {
      console.error('Error validating answers:', error);
    }
  }, [answers, type, earnTokenName, campaignId, questionId, dispatch, handleQuestionClose]);

  return (
    <>
      <Container>
        <NoticeMessage>
          <p>{_t('894c24446a234000a846')}</p>
        </NoticeMessage>
        {pullGemPoolExamLoading ? (
          <Loading>
            <Spins size="small" />
          </Loading>
        ) : (
          <>
            {questions.map((question) => (
              <QuestionContainer key={question.busId}>
                <QuestionTitle>
                  {question.questionNo}. {question.question}
                </QuestionTitle>
                {/* 先写死 4 个答案，后端这里也是写死的，后面如果是动态题库，前后端都要改返回结构 */}
                <Radio.Group
                  size="small"
                  name={`question-${question.busId}`}
                  value={answers[`${question.busId}`]}
                  onChange={(e) => handleAnswerChange(question.busId, e.target.value)}
                >
                  {[1, 2, 3, 4].map((option) => (
                    <AnswerOption
                      key={option}
                      isSelected={answers[`${question.busId}`] === `answer${option}`}
                      isError={
                        //answers[`${question.busId}`] === `answer${option}` &&
                        isSubmitted && errors[question.busId] === `answer${option}`
                      }
                    >
                      <Radio value={`answer${option}`}>{question[`answer${option}`]}</Radio>
                    </AnswerOption>
                  ))}
                </Radio.Group>
              </QuestionContainer>
            ))}
          </>
        )}
      </Container>
      {Object.keys(errors)?.length > 0 ? (
        <WarningOptions>{_t('f4c90afeafa24000a1ba')}</WarningOptions>
      ) : (
        <ButtonDivider />
      )}
      <BottomContainer>
        {!isSubmitted ? (
          <SubmitButton
            loading={postGemPoolExamSubmitLoading}
            onClick={handleSubmit}
            disabled={isSubmitted || Object.keys(answers)?.length !== questions?.length}
          >
            {`${_t('confirm')} (${Object.keys(answers)?.length}/${questions?.length})`}
          </SubmitButton>
        ) : (
          <>
            <CancelButton variant="outlined" onClick={handleQuestionClose} type="default">
              {_t('cancel')}
            </CancelButton>
            <SubmitButton loading={postGemPoolExamSubmitLoading} onClick={handleSubmit}>
              {_t('309affd51e574000a5e5')}
            </SubmitButton>
          </>
        )}
      </BottomContainer>
    </>
  );
};

const QuestionModal = ({ type }) => {
  const dispatch = useDispatch();
  const { currentLang } = useLocale();

  const [examData, setExamData] = useState([]);
  const [resultDialogVisible, setResultDialogVisible] = useState(false);
  const [bonusCoefficientValue, setBonusCoefficientValue] = useState(0);

  const questionModal = useSelector((state) => state.gempool.questionModal);
  const questionId = useSelector((state) => state.gempool.questionId);

  const handleClose = useCallback(() => {
    dispatch({
      type: 'gempool/update',
      payload: {
        questionModal: false,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    if (questionModal && questionId) {
      dispatch({
        type: 'gempool/pullGemPoolExam',
        payload: {
          campaignId: questionId,
        },
      }).then((data) => {
        setExamData(data);
      });
    }
  }, [dispatch, questionModal, questionId]);

  return (
    <>
      <Modal
        open={questionModal && !resultDialogVisible}
        size="large"
        onClose={handleClose}
        destroyOnClose
        title={_t('71e98f8381cc4000a0ce')}
      >
        <CotentWrapper>
          <QuizComponent
            questions={examData}
            handleQuestionClose={handleClose}
            handleResultDialogVisible={setResultDialogVisible}
            handleBonusCoefficientValue={setBonusCoefficientValue}
            type={type}
            questionId={questionId}
          />
        </CotentWrapper>
      </Modal>
      {resultDialogVisible && (
        <StatusModal
          visible={resultDialogVisible}
          setDialogVisible={setResultDialogVisible}
          resultStatus={EnumStatus.Success}
          contentTitle={_t('a2b36a6728394000a77c') + '🎉'}
          contentText={_tHTML('e669d6659c384000a86f', {
            rate:
              '+' +
              numberFormat({
                number: bonusCoefficientValue,
                lang: currentLang,
                options: { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 },
              }),
          })}
          okText={_t('i.know')}
        />
      )}
    </>
  );
};

export default QuestionModal;

QuizComponent.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      questionNo: PropTypes.number.isRequired,
      question: PropTypes.string.isRequired,
      answer1: PropTypes.string,
      answer2: PropTypes.string,
      answer3: PropTypes.string,
      answer4: PropTypes.string,
    }),
  ).isRequired,
  handleQuestionClose: PropTypes.func.isRequired,
};
