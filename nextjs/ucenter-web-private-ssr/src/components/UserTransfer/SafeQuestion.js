/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Button, Form, Input, Select } from '@kux/mui';
import KCSvgIcon from 'components/common/KCSvgIcon';
import React from 'react';
import { connect } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import { FormBody, FormTitle, SafeQuestionsSuccess, SafeQuestionWrapper } from './styled';

const { FormItem, withForm } = Form;

@connect((state) => {
  const { language } = state.user.user || {};
  return {
    language,
  };
})
@withForm()
@injectLocale
export default class SafeQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: props.step || 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ('step' in nextProps) {
      return {
        ...prevState,
        step: nextProps.step,
      };
    }
  }

  handleSubmit = () => {
    const { onSubmit = () => {} } = this.props;
    this.props.form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  render() {
    const { loading, step, questions } = this.props;
    const initialValue = questions[0] ? questions[0][0] : undefined;
    const url = addLangToPath('/support/requests');

    const selectOptions = questions.map((question) => ({
      label: question[1],
      value: question[0],
    }));

    return (
      <SafeQuestionWrapper>
        <FormTitle>
          <h1>{step === 0 ? _t('verify.sec.question') : _t('sec.question')}</h1>
        </FormTitle>
        {step === 0 ? (
          <FormBody>
            <FormItem
              initialValue={initialValue}
              name="question"
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
              ]}
            >
              <Select size="large" allowClear options={selectOptions} />
            </FormItem>
            <FormItem
              name="answer"
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
              ]}
            >
              <Input allowClear={true} size="large" />
            </FormItem>
            <Button
              loading={loading}
              fullWidth
              type="primary"
              size="large"
              onClick={this.handleSubmit}
            >
              {_t('confirm')}
            </Button>
            <p className="forget">
              <a target="_blank" rel="noopener noreferrer" href={url}>
                {_t('forget.sec.question')}?
              </a>
            </p>
          </FormBody>
        ) : (
          <SafeQuestionsSuccess>
            <p>
              <KCSvgIcon style={{ width: '64px', height: '64px' }} iconId="Checkmark" />
            </p>
            <p>{_t('validate.succeed')}</p>
          </SafeQuestionsSuccess>
        )}
      </SafeQuestionWrapper>
    );
  }
}
