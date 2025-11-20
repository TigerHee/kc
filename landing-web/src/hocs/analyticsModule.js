/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { ga, getGaElement } from 'utils/ga';

/**
 * 埋点方法，针对 google react-ga 以及 @kc/report 进行封装
 */
const AnalyticsModule = () => WrappedComponent => {
  return class GAComponent extends React.Component {
    componentDidMount() {
      if (!_DEV_) {
        document.body.addEventListener(
          'click',
          e => {
            const target = e.target;
            const key = getGaElement(target, 'data-ga');
            key && ga(key);
          },
          true,
        );
      }
    }

    render() {
      return (
        <div className="__analytics-module">
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};

export default AnalyticsModule;
