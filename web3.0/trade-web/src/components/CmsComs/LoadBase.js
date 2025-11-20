/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { Parser } from 'html-to-react';
import ErrorBoundary from './ErrorBoundary';

const htmlToReactParser = new Parser();

export default class LoadBase extends React.Component {
  renderHead = () => {
    return null;
  }

  getComponentId = () => {
    return this.props.run;
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
    React.Children.forEach(nodes.props.children, (child) => {
      if (React.isValidElement(child)) {
        childs.push(child);
      }
    });

    return (
      <ErrorBoundary>
        <React.Fragment key={run}>
          {this.renderHead()}
          {childs}
        </React.Fragment>
      </ErrorBoundary>

    );
  }
}
