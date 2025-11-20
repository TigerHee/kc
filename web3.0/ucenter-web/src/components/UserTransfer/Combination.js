/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import SafeQuestion from './SafeQuestion';
import SetPassword from './SetPassword';
import { CombinationWrapper, LeftSection, RightSection } from './styled';

@connect((state) => {
  return {
    questions: state.utransfer.questions,
  };
})
@injectLocale
export default class Combination extends React.Component {
  state = {
    step: 0,
  };

  handleQuestionSubmit = async (values) => {
    const { question, answer } = values;
    await this.props.dispatch({
      type: 'utransfer/verify_question',
      payload: {
        bizType: 'USER_UPGRADE',
        'validations[SECURITY_QUESTION]': `${question}:${answer}`,
      },
    });
    this.setState({
      step: 1,
    });
  };

  render() {
    const { step } = this.state;
    const cls = step === 1 ? 'over' : null;
    const { questions } = this.props;
    return (
      <CombinationWrapper>
        <LeftSection className={cls}>
          <SafeQuestion questions={questions} onSubmit={this.handleQuestionSubmit} step={step} />
        </LeftSection>
        <RightSection className={cls}>
          <SetPassword step={step} title={_t('upgrade.to.trade.code')} />
        </RightSection>
      </CombinationWrapper>
    );
  }
}
