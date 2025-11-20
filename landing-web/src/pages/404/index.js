/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { replace } from 'umi/router';

export default class Page404 extends React.Component {
  componentDidMount() {
    replace('/error');
  }

  render() {
    return null;
  }
}
