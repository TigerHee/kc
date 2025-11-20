/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'dva';
import Head from 'react-helmet';
import { Parser } from 'html-to-react';
import ErrorBoundary from './ErrorBoundary';

const htmlToReactParser = new Parser();

@connect((state) => {
  return {
    body: state.components.body,
  };
})
export default class Heads extends React.Component {
  render() {
    const { body, run } = this.props;


    // const _div = document.createElement('div');
    const keys = ['com.head'];
    return (
      <React.Fragment>
        {_.map(keys, (key) => {
          const html = body[key];
          if (html) {
            const nodes = htmlToReactParser.parse(`${html}`);

            const childs = [];
            React.Children.forEach(nodes.props.children, (child) => {
              if (React.isValidElement(child)) {
                childs.push(child);
              }
            });
            return (
              <ErrorBoundary>
                <Head key={key}>
                  {childs}
                </Head>
              </ErrorBoundary>

            );
          }

          return null;
        })}
      </React.Fragment>
    );
  }
}
