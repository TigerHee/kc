import { Alert, Button, Empty, Form, Input, Modal } from '@kux/design';
import classNames from 'classnames';
import { OPTIONS, QUESTION_KEYS, QUESTION_LIST } from 'components/QuestionSecurity/config';
import cloneDeep from 'lodash-es/cloneDeep';
import isFunction from 'lodash-es/isFunction';
import map from 'lodash-es/map';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from 'src/components/Account/Kyc/common/components/CustomSelect';
import { tenantConfig } from 'src/config/tenant';
import { postVerifyQuestions, pullQuestions } from 'src/services/ucenter/reset-security';
import { _t, _tHTML } from 'src/tools/i18n';
import ExLoading from '../ExLoading';
import * as commonStyles from '../styles.module.scss';
import * as styles from './styles.module.scss';

const { FormItem, useForm } = Form;

const RENDER_TYPE = {
  SINGLE: 'single',
  MULTI: 'multi',
  INPUT: 'input',
  COUNTRY: 'country',
};

const ERROR_TYPE = {
  /** 答错题目 */
  WRONG: 'wrong',
  /** 超时 */
  TIMEOUT: 'timeout',
  /** 禁止使用 */
  PROHIBIT: 'prohibit',
};

export default function QuestionVerification({ token, onExist, onNext }) {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const renderIds = questions.map((question) => question.id);
  const [verifyRes, setVerifyRes] = useState({ open: false, remainTimes: 3, timeout: false });
  const [errorType, setErrorType] = useState(null);
  const [loading, setLoading] = useState(false);

  const { countriesWithWhiteList } = useSelector((state) => state.kyc);

  const errorModalContents = useMemo(() => {
    return {
      [ERROR_TYPE.WRONG]: {
        title: _t('8dd1edc408854000acef'),
        description: _t('18d8e81f6fee4800ae1a', { num: verifyRes.remainTimes }),
        okText: _t('retry'),
        onOk: () => setVerifyRes({ open: false }),
        cancelText: null,
        onClose: () => setVerifyRes({ open: false }),
      },
      [ERROR_TYPE.TIMEOUT]: {
        title: _t('8dd1edc408854000acef'),
        description: _t('1d15e4805bd14800ac4b'),
        okText: _t('i.know'),
        onOk: onExist,
        cancelText: null,
        onClose: onExist,
      },
      [ERROR_TYPE.PROHIBIT]: {
        title: _t('8dd1edc408854000acef'),
        description: _t('b28372c1eff54800a3e2'),
        okText: _t('i.know'),
        onOk: onExist,
        cancelText: _t('4925cb44868a4000aa9c'),
        onCancel: () => {
          location.href = tenantConfig.resetSecurity.supportUrl;
        },
        onClose: onExist,
      },
    };
  }, [verifyRes]);

  const countryOptions = map(countriesWithWhiteList, (item) => {
    if (item.code === 'OT') {
      return {
        label: (isInSelectInput) => {
          return (
            <div>
              {item.name}
              {item.code === 'OT' && !isInSelectInput ? <div>{_t('kyc.country.other')}</div> : null}
            </div>
          );
        },
        value: item.code,
        title: item.name,
      };
    }
    return { label: () => item.name, value: item.code, title: item.name };
  });

  const renderList = questions.map((question) => {
    let options = [];
    if (question.options) {
      options = question.options.map((o) => {
        const a = [...OPTIONS].find((arr) => arr[0] === o.id) || [];
        const option = a[1] ? a[1]() : o.option;
        return { id: o.id, option };
      });
    }
    const nameArr = [...QUESTION_LIST].find((l) => l[0] === question.id) || [];
    return { ...question, name: nameArr[1] ? nameArr[1]() : '', options };
  });

  // 点击提交，问题答案校验
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await postVerifyQuestions({
        token,
        data: JSON.stringify(answers),
      });
      if (res.data?.checkResult !== 'SUCCESS') {
        throw res;
      }
      onNext();
    } catch (error) {
      const { code, data } = error || {};
      const { maxFailedCount = 3, failedCount = 0 } = data || {};
      const remainTimes = maxFailedCount - failedCount;
      if (code === '40001' || (code === '40007' && remainTimes <= 0)) {
        // 没有机会了
        setErrorType(ERROR_TYPE.PROHIBIT);
        setVerifyRes({ open: true, remainTimes, timeout: true });
      } else if (code === '500851') {
        // 超时
        setErrorType(ERROR_TYPE.TIMEOUT);
        setVerifyRes({ open: true, remainTimes, timeout: true });
      } else {
        // 答错
        setErrorType(ERROR_TYPE.WRONG);
        setVerifyRes({
          open: true,
          remainTimes,
          timeout: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 单选或者多选
  const handleSelect = (questionId, clickAnswer, isSingle) => {
    const newAnswers = cloneDeep(answers);
    const i = newAnswers.findIndex((a) => a.id === questionId);
    if (answers[i].options.find((o) => o.answer === clickAnswer.id)) {
      newAnswers[i].options = answers[i].options.filter((o) => o.answer !== clickAnswer.id);
    } else {
      isSingle
        ? (newAnswers[i].options = [{ answer: clickAnswer.id }])
        : newAnswers[i].options.push({ answer: clickAnswer.id });
    }
    setAnswers(newAnswers);
  };

  // 单选或者多选的表单项， renderId: 表示，显示选项的id还是option
  const commonFormItem = (id, index, renderType) => {
    if (!renderIds.includes(id)) {
      return null;
    }
    const handleChange = (id, value) => {
      const newAnswers = answers.map((a) => {
        if (a.id === id) {
          return { ...a, options: [{ answer: value }] };
        }
        return a;
      });
      setAnswers(newAnswers);
    };
    return (
      <div>
        <div className={styles.subTitle}>
          {index + 1}. {renderList.find((l) => l.id === id)?.name}
        </div>
        <FormItem name={id}>
          <div className={styles.answersWrapper}>
            {renderType === RENDER_TYPE.INPUT ? (
              <Input
                allowClear={true}
                size="xlarge"
                placeholder={_t('selfService2.questionSecurity.placeholder')}
                onChange={(e) => handleChange(id, e.target.value)}
              />
            ) : renderType === RENDER_TYPE.COUNTRY ? (
              <CustomSelect
                allowSearch
                size="xlarge"
                options={countryOptions}
                placeholder={_t('selfService2.questionSecurity.placeholder')}
                value={answers.find((a) => a.id === id)?.options[0]?.answer}
                onChange={(value) => handleChange(id, value)}
                // classNames={{ dropdownContainer: ContryDropdown }}
              />
            ) : [RENDER_TYPE.SINGLE, RENDER_TYPE.MULTI].includes(renderType) ? (
              map(renderList.find((l) => l.id === id)?.options, (item) => {
                const isKYCstatus = id === QUESTION_KEYS.KYCStatus;
                const isSelected = answers
                  ?.find((a) => a.id === id)
                  ?.options.map((o) => o.answer)
                  ?.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={classNames(
                      styles.selectItem,
                      isKYCstatus && styles.large,
                      isSelected && styles.active,
                    )}
                    data-inspector={`question-option-${item.id}`}
                    onClick={() => handleSelect(id, item, renderType !== RENDER_TYPE.MULTI)}
                  >
                    {isFunction(item?.option) ? item?.option() : item?.option}
                  </div>
                );
              })
            ) : null}
          </div>
        </FormItem>
      </div>
    );
  };

  const renderIdsStr = renderIds.join();

  const handleStart = async () => {
    setQuestions([]);
    try {
      setLoading(true);
      const res = await pullQuestions({ bizType: 'reset_security', token });
      setQuestions(res.items.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleStart();
  }, []);

  // 初始化问题答案
  useEffect(() => {
    const newAnswers = renderList.map((q) => ({ id: q.id, options: [] }));
    setAnswers(newAnswers);
    const date = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - date >= 5 * 60 * 1000) {
        // 超过 5 分钟自动提交
        handleSubmit();
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [renderIdsStr]);

  // 拉取kyc国家区号
  useEffect(() => {
    if (renderIds.includes(QUESTION_KEYS.country)) {
      dispatch({ type: 'kyc/kycGetCountries2', payload: { token: token || '' } });
    }
  }, [renderIdsStr]);

  return (
    <ExLoading loading={loading} className={commonStyles.container}>
      <div className={commonStyles.header}>{_t('01ec7d2744564000abad')}</div>
      <div className={styles.alertWrapper}>
        <Alert
          type="info"
          duration={0}
          message={
            <div className={styles.tips}>
              <div>{_tHTML('d853b48938f14000a733')}</div>
              <div>{_tHTML('54dc3fa1e1c14800a767')}</div>
              <div>{_tHTML('d2cd93a39c494000a228')}</div>
            </div>
          }
        />
      </div>
      <Form form={form} className={styles.formWrapper}>
        {questions.map((question, index) => {
          switch (question.id) {
            case QUESTION_KEYS.deposit:
              /* 最近充提过的两个币种是 */
              return commonFormItem(question.id, index, RENDER_TYPE.MULTI);
            case QUESTION_KEYS.tradeCoin:
              /* 最近交易两个币种是 */
              return commonFormItem(question.id, index, RENDER_TYPE.MULTI);
            case QUESTION_KEYS.holdBtc:
              /* 持有的BTC数量？ */
              return commonFormItem(question.id, index, RENDER_TYPE.SINGLE);
            case QUESTION_KEYS.holdUSDT:
              /* 持有的USDT数量？ */
              return commonFormItem(question.id, index, RENDER_TYPE.SINGLE);
            case QUESTION_KEYS.accountCoin:
              /* 和您账户相关的币种 */
              return commonFormItem(question.id, index, RENDER_TYPE.MULTI);
            case QUESTION_KEYS.KYCStatus:
              /* KYC认证状态 */
              return commonFormItem(question.id, index, RENDER_TYPE.SINGLE);
            case QUESTION_KEYS.KYCName:
              /* 您实名认证的姓名全称是？ */
              return commonFormItem(question.id, index, RENDER_TYPE.INPUT);
            case QUESTION_KEYS.country:
              /* 您账户认证的国籍是？ */
              return commonFormItem(question.id, index, RENDER_TYPE.COUNTRY);
            case QUESTION_KEYS.nikeName:
              /* 您kucoin的账户昵称是 */
              return commonFormItem(question.id, index, RENDER_TYPE.INPUT);
            default:
              return null;
          }
        })}
      </Form>
      <div className={styles.btnWrapper}>
        <Button onClick={handleSubmit} type="primary" size="large" fullWidth>
          {_t('confirm')}
        </Button>
      </div>
      <Modal
        isOpen={verifyRes.open}
        okText={errorModalContents[errorType]?.okText}
        onOk={errorModalContents[errorType]?.onOk}
        cancelText={errorModalContents[errorType]?.cancelText}
        onCancel={errorModalContents[errorType]?.onCancel}
        onClose={errorModalContents[errorType]?.onClose}
        className={styles.errorDialog}
        footerDirection="vertical"
      >
        <Empty
          name="warn"
          size="small"
          title={errorModalContents[errorType]?.title}
          description={errorModalContents[errorType]?.description}
        />
      </Modal>
    </ExLoading>
  );
}
