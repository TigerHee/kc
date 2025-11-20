/**
 * Owner: willen@kupotech.com
 */
/**
 * 安全问题认证
 */
import { Button, Col, Form, Input, Row, Select } from '@kux/mui';
import _, { cloneDeep, isFunction, map } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectIcon from 'static/account/select.svg';
import { _t } from 'tools/i18n';
import { OPTIONS, QUESTION_KEYS, QUESTION_LIST } from './config';
import {
  AnswersWrapper,
  ContryDropdown,
  FormWrapper,
  FullWidthBtn,
  SelectItem,
  SelectItemActive,
  SelectItemWrapper,
  SubTitle,
  Triangle,
} from './styled';

const { FormItem, useForm } = Form;

const QuestionForm = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.effects['security_new/sec_verify']);
  const { countriesWithWhiteList } = useSelector((state) => state.kyc);
  const { onNext, questions = [], token } = props;
  const [answers, setAnswers] = useState([]);
  const [form] = useForm();
  const renderIds = questions.map((question) => question.id);

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

  // 初始化问题答案
  useEffect(() => {
    const newAnswers = renderList.map((q) => ({ id: q.id, options: [] }));
    setAnswers(newAnswers);
  }, [renderIds.join()]);

  // 拉取kyc国家区号
  useEffect(() => {
    if (renderIds.includes(QUESTION_KEYS.country)) {
      dispatch({ type: 'kyc/kycGetCountries2', payload: { token } });
    }
  }, [renderIds.length]);

  // 点击提交，问题答案校验
  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((res) => {
        const result = [...answers];
        Object.entries(res).map((entry) => {
          if (entry[1]) {
            const i = answers.findIndex((a) => a.id === entry[0]);
            result[i].options = [{ answer: entry[1].trim() }];
          }
        });
        if (onNext) {
          onNext(result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [form, onNext, answers]);

  // 单选或者多选
  const handleSelect = useCallback(
    (questionId, clickAnswer, isSingle) => {
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
    },
    [answers],
  );

  // 单选或者多选的表单项， renderId: 表示，显示选项的id还是option
  const commonFormItem = useCallback(
    (id, isSingle) => {
      if (!renderIds.includes(id)) {
        return null;
      }
      console.log(
        'renderList.find((l) => l.id === id)?.name',
        renderList.find((l) => l.id === id)?.name,
      );
      return (
        // <FormItem name={id} label={renderList.find((l) => l.id === id)?.name}>
        <div>
          <SubTitle>{renderList.find((l) => l.id === id)?.name}</SubTitle>
          <FormItem name={id}>
            <Row gutter={12} css={AnswersWrapper}>
              {map(renderList.find((l) => l.id === id)?.options, (item) => {
                const isSelected = answers
                  ?.find((a) => a.id === id)
                  ?.options.map((o) => o.answer)
                  ?.includes(item.id);
                const isKYCstatus = id === QUESTION_KEYS.KYCStatus;
                const Item = isSelected ? SelectItemActive : SelectItem;
                return (
                  <Col
                    key={`trade-coin-${item.id}`}
                    sm={isKYCstatus ? 12 : 8}
                    md={6}
                    lg={6}
                    css={SelectItemWrapper}
                  >
                    <Item
                      data-inspector={`question-option-${item.id}`}
                      onClick={() => handleSelect(id, item, isSingle)}
                    >
                      {isFunction(item?.option) ? item?.option() : item?.option}
                      {isSelected && <Triangle />}
                      {isSelected && <img src={selectIcon} alt="select-icon" />}
                    </Item>
                  </Col>
                );
              })}
            </Row>
          </FormItem>
        </div>
      );
    },
    [handleSelect, answers, renderIds],
  );

  const countryOptions = _.map(countriesWithWhiteList, (item) => {
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
    return { label: item.name, value: item.code, title: item.name };
  });

  return (
    <Form css={FormWrapper} form={form}>
      {/* 最近充提过的两个币种是 */}
      {commonFormItem(QUESTION_KEYS.deposit)}
      {/* 最近交易两个币种是 */}
      {commonFormItem(QUESTION_KEYS.tradeCoin)}
      {/* 持有的BTC数量？ */}
      {commonFormItem(QUESTION_KEYS.holdBtc, true)}
      {/* 持有的USDT数量？ */}
      {commonFormItem(QUESTION_KEYS.holdUSDT, true)}
      {/* 账户相关币种 */}
      {commonFormItem(QUESTION_KEYS.accountCoin)}
      {/* KYC认证状态 */}
      {commonFormItem(QUESTION_KEYS.KYCStatus, true)}
      {/* 您kyc基础认证的姓名是？ */}
      {renderIds.includes(QUESTION_KEYS.KYCName) && (
        <FormItem
          name={QUESTION_KEYS.KYCName}
          label={renderList.find((l) => l.id === QUESTION_KEYS.KYCName)?.name}
        >
          <Input
            allowClear={true}
            size="xlarge"
            placeholder={_t('selfService2.questionSecurity.placeholder')}
          />
        </FormItem>
      )}
      {/* 您账户认证的国籍是？ */}
      {renderIds.includes(QUESTION_KEYS.country) && (
        <FormItem
          name={QUESTION_KEYS.country}
          label={renderList.find((l) => l.id === QUESTION_KEYS.country)?.name}
        >
          <Select
            allowSearch
            allowClear
            size="xlarge"
            options={countryOptions}
            placeholder={_t('selfService2.questionSecurity.placeholder')}
            classNames={{ dropdownContainer: ContryDropdown }}
          />
        </FormItem>
      )}
      {/* 您kucoin的账户昵称是 */}
      {renderIds.includes(QUESTION_KEYS.nikeName) && (
        <FormItem
          name={QUESTION_KEYS.nikeName}
          label={renderList.find((l) => l.id === QUESTION_KEYS.nikeName)?.name}
        >
          <Input
            allowClear={true}
            size="xlarge"
            placeholder={_t('selfService2.questionSecurity.placeholder')}
          />
        </FormItem>
      )}
      <FormItem>
        <Button onClick={handleSubmit} size="large" css={FullWidthBtn} loading={loading}>
          {_t('next')}
        </Button>
      </FormItem>
    </Form>
  );
};

export default QuestionForm;
