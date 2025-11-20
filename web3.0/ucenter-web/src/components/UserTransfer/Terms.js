/**
 * Owner: willen@kupotech.com
 */
import { Button } from '@kux/mui';
import Html from 'components/common/Html';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { en_content, en_notice } from './En';
import Private_content from './privit';
import { ItemsFoot, Main, TermsContainer, TermsWrapper } from './styled';
import { zh_content, zh_notice } from './Zh';

class CutDown extends React.Component {
  timer = 0;

  interval = 1000;

  constructor(props) {
    super(props);
    const time = props.time || 0;
    this.state = {
      time: props.time || 0,
      text: `(${time}s)`,
    };
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.end();
  }

  end = () => {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.timer = null;
  };

  start = () => {
    this.timer = window.setInterval(() => {
      this.tick();
    }, this.interval);
  };

  tick = () => {
    let { time, text } = this.state;
    const { onEnd } = this.props;
    if (time <= 0) {
      time = 0;
      text = null;
      this.end();
      if (onEnd) {
        onEnd();
      }
    } else {
      time -= 1;
      text = `(${time}s)`;
    }
    this.setState({
      time,
      text,
    });
  };

  render() {
    const { text } = this.state;
    return <React.Fragment>{text}</React.Fragment>;
  }
}

@connect((state) => {
  const { language } = state.user.user || {};
  return {
    language,
  };
})
export default class Terms extends React.Component {
  state = {
    disabled: true,
  };

  onEnd = () => {
    this.setState({
      disabled: false,
    });
  };

  render() {
    const { disabled } = this.state;
    const { language } = this.props;
    const notice = language === 'zh_CN' ? zh_notice : en_notice;
    const content = language === 'zh_CN' ? zh_content : en_content;
    return (
      <TermsContainer>
        <TermsWrapper>
          <div key="head">
            <h1>{_t('user.notice')}</h1>
          </div>
          <Main key="main">
            <section>
              <h4>{_t('important.notice')}</h4>
              <div>
                <Html style={{ background: 'none' }}>{notice}</Html>
              </div>
            </section>
            <section>
              <h4>{_t('termsOfUse')}</h4>
              <div>
                <Html style={{ background: 'none' }}>{content}</Html>
              </div>
            </section>
            <section>
              <h4>Privacy Policy</h4>
              <div>
                <Html style={{ background: 'none' }}>{Private_content}</Html>
              </div>
            </section>
          </Main>
          <ItemsFoot>
            <Button disabled={disabled} fullWidth onClick={this.props.onClick}>
              <span className="mr-4">{_t('agree.term.of.use')}</span>{' '}
              <CutDown time={10} onEnd={this.onEnd} />
            </Button>
          </ItemsFoot>
        </TermsWrapper>
      </TermsContainer>
    );
  }
}
