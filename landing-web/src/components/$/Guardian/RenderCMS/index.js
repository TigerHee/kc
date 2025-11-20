/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { Parser } from 'html-to-react';
import { connect } from 'dva';
import LoadStyle from 'components/CmsComs/LoadStyle';

const htmlToReactParser = new Parser();

@connect((state) => {
  return {
    body: state.components.body,
  };
})
export default class RenderCMS extends React.Component {

  getComponentId = () => {
    return this.props.run;
  }

  componentDidMount() {
    // const { dispatch, run } = this.props;
    // dispatch({
    //   type: 'components/fetch',
    //   payload: {
    //     componentToload: [run],
    //   },
    // });

  }

  render() {
    const { body, renderChildren } = this.props;
    const run = this.getComponentId();

    const html = body[run];
    if (!html) {
      return <div />;
    }

    const [topDomain] = window.location.hostname.split('.').reverse();
    const _top = ['localhost', 'net'].indexOf(topDomain) > -1  ? 'com' : topDomain;
    const _html = html.replace(/assets-currency\.kucoin\.cc/g, `assets-currency.kucoin.${_top}`);
    const nodes = htmlToReactParser.parse(`<div>${_html}</div>`);

    const childs = [];
    React.Children.forEach(nodes.props.children, (child) => {
      if (React.isValidElement(child)) {
        childs.push(child);
      }
    });

    let _content = null;

    if(renderChildren) {
      _content = renderChildren(nodes);
    }

    return (
      <React.Fragment key={run}>
        <LoadStyle run={run} />
        {_content || childs}
      </React.Fragment>
    );
  }
}
