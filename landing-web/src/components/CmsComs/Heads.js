/**
 * Owner: jesse.shao@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
// import Head from 'next/head';
import { Parser } from 'html-to-react';
import { Helmet } from 'react-helmet';

import ErrorBoundary from './ErrorBoundary';

const htmlToReactParser = new Parser();

@connect(state => {
  return {
    body: state.components.body,
  };
})
class Heads extends React.Component {
  componentDidMount() {
   const { dispatch } = this.props;
    dispatch({
        type: `components/fetch`,
        payload: {
          componentsToload: ['cms.common'],
        },
    });
  }
  render() {
    const { body } = this.props;
    const keys = ['com.head'];
    return (
      <React.Fragment>
        {_.map(keys, ( key) => {
          const html = body[key];
          if (html) {
            const nodes = htmlToReactParser.parse(html);

            const childs = [];
            React.Children.forEach(nodes.props.children, child => {
              if (React.isValidElement(child)) {
                childs.push(child);
              }
            });

            return (
              <ErrorBoundary key={key}>
                <Helmet>{childs}</Helmet>
              </ErrorBoundary>
            );
          }

          return null;
        })}
      </React.Fragment>
    );
  }
}
export default Heads;
