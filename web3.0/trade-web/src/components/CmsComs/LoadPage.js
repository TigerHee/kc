/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'dva';
import { genComponentCssPath } from 'utils/cmptUtils';
import Head from 'react-helmet';
import { Parser } from 'html-to-react';

const htmlToReactParser = new Parser();

class RunScript extends React.Component {
  componentDidMount() {
    const { script } = this.props;
    eval(`${script}`); // eslint-disable-line no-eval
  }
  render() {
    return null;
  }
}

@connect((state) => {
  return {
    body: state.components.pageCmpt,
  };
})
export default class LoadPage extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    // this.getComponents();
    const cmptId = this.getComponentId();
    dispatch({
      type: 'components/fetchAlone',
      payload: {
        componentToload: cmptId,
      },
    });
  }

  renderHead = () => {
    const { curlang } = this.props;
    const cmptId = this.getComponentId();
    return (
      <Head key="com-alone-page-style">
        <link rel="stylesheet" href={genComponentCssPath(curlang, [[cmptId]])} />
      </Head>
    );
  }
  // 平接组件名称
  getComponentId = () => {
    // com.footer.links
    return `com.page.${this.props.run}`;
  }

  render() {
    const { body } = this.props;
    const run = this.getComponentId();

    const html = body[run];
    if (!html) {
      return <div />;
    }

    const nodes = htmlToReactParser.parse(`<div>${html}</div>`);

    const childs = [];
    let script = null;
    React.Children.forEach(nodes.props.children, (child) => {
      if (React.isValidElement(child)) {
        // 限制一下，页面组件script仅允许第一个一级标签执行
        React.Children.forEach(child.props.children, (firstChild, index) => {
          if (script === null &&
            React.isValidElement(firstChild) &&
            firstChild.type === 'script'
          ) {
            script = <RunScript script={firstChild.props.children} />;
          }
        });
        childs.push(child);
      }
    });

    return (
      <React.Fragment key={run}>
        {this.renderHead()}
        {childs}
        {script}
      </React.Fragment>
    );
  }
}
