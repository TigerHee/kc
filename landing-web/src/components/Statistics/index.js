/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';


export default class Statistics extends React.Component {
  constructor(props) {
    super(props);
    // ReactGA.initialize('UA-46608064-1');
  }

  componentDidMount() {
    this.pageView();
  }

  pageView = () => {
    // ReactGA.pageview(window.location.href);
  };

  componentDidUpdate(prevProps) {
    if (this.props.pathname !== prevProps.pathname) {
      this.pageView();
    }
  }

  render() {
    return null;
  }
}
