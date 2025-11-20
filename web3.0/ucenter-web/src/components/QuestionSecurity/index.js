/**
 * Owner: willen@kupotech.com
 */
/**
 * 安全问题认证
 *
 */
import { Button, Spin, useSnackbar } from '@kux/mui';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fail from 'static/account/fail.svg';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import AlertInfo from '../Account/SecurityForm/Alert';
import QuestionForm from './QuestionForm';
import { FailDes, FailImg, FailTitle, LastLine, retryBtn, TipWrapper, Wrapper } from './styled';

const QuestionSecurity = (props) => {
  const dispatch = useDispatch();
  const { nextStep, namespace, bizType, token } = props;
  const loading = useSelector((state) => state.loading.effects[`${namespace}/pullQuestions`]);
  const { questions } = useSelector((state) => state[namespace]);
  const { message } = useSnackbar();
  // 显示问题验证失败， 重试页面
  const [retry, setRetry] = useState();
  const [retryTimes, setRetryTimes] = useState(0);
  // 安全问题认证没到3次但是总校验次数用完，直接进入下一步-》人工审核
  const [goNext, setGoNext] = useState(false);

  const pullQuestions = useCallback(() => {
    trackClick(['QuestionVerfication', '1']);
    dispatch({
      type: `${namespace}/pullQuestions`,
      payload: { bizType, token },
    });
  }, []);

  useEffect(() => {
    pullQuestions();
  }, [pullQuestions]);

  const handleNext = useCallback(
    (data) => {
      dispatch({
        type: 'security_new/sec_verify',
        payload: {
          bizType,
          validationType: 'self_question',
          validationVal: `${JSON.stringify(data)}`,
          extraParams: { token },
        },
      }).then(({ success }) => {
        if (success) {
          message.success(_t('operation.succeed'));
          trackClick([`QuestionVerficationS${retryTimes + 1}`, '1']);
          nextStep();
          return;
        }
        // 失败查询失败次数
        if (!success) {
          dispatch({
            type: `${namespace}/pullFailCount`,
            payload: {
              bizType,
              token,
            },
            callBack: (d) => {
              setRetryTimes(d.self_question > 2 ? 3 : d.self_question);
              setGoNext(d.self_question > 2);
              setRetry(true);
            },
          });
        }
      });
    },
    [retryTimes, message, nextStep, token],
  );

  // 点击重试
  const handleRetry = useCallback(() => {
    trackClick([`QuestionVerfication${retryTimes}`, '1']);
    // 进入人工审核
    if (goNext) {
      nextStep();
    }
    setRetry(false);
    pullQuestions();
  }, [retryTimes, nextStep, retryTimes, goNext]);

  if (retry) {
    return (
      <Fragment>
        <FailImg alt="fail-icon" src={fail} />
        <FailTitle>{_t('selfService2.verify.fail')}</FailTitle>
        <FailDes>
          {goNext ? _t('selfService2.verify.fail.des1') : _t('selfService2.verify.fail.des2')}
        </FailDes>
        <Button onClick={handleRetry} className={retryBtn}>
          {goNext ? _t('next') : _t('selfService2.verify.fail.btn')}
        </Button>
      </Fragment>
    );
  }

  return (
    <Wrapper>
      {/* <Title>{_t('selfService2.questionSecurity')}</Title> */}
      <AlertInfo type="warning" description={_t('security.24h.limit')} />
      <TipWrapper>
        <span>{_tHTML('selfService2.questionSecurity.des1')}</span>
        <span>{_t('selfService2.questionSecurity.des2')}</span>
        <LastLine>{_tHTML('selfService2.questionSecurity.des3')}</LastLine>
      </TipWrapper>
      <Spin spinning={loading}>
        <QuestionForm onNext={handleNext} questions={questions} token={token} />
      </Spin>
    </Wrapper>
  );
};

export default QuestionSecurity;
