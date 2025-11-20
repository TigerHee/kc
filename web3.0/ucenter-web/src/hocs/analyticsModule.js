/**
 * Owner: willen@kupotech.com
 */
import React from 'react';

/**
 * 埋点方法，针对 google react-ga 以及 @kc/report 进行封装
 * 使用方法：参考 src/routes/HomePage/HomeMarketTable
 */
const AnalyticsModule = () => (WrappedComponent) => {
  return class GAComponent extends React.Component {
    componentDidMount() {
      if (!_DEV_) {
        document.body.addEventListener(
          'click',
          (e) => {
            const { target } = e;
            // 这里的上报可利用主线程空闲时间进行上报
            window.requestIdleCallback(() => {
              import('utils/ga/ga').then(({ ga, getGaElement }) => {
                const key = getGaElement(target, 'data-ga');
                key && ga(key);
              });
            });
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
