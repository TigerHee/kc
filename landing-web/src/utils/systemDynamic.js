/**
 * Owner: jesse.shao@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2022-05-23 11:49:07
 * @Description: Systemjs 异步加载组件
 */
import React from 'react';
import { get, noop } from 'lodash';

export default function (packageName, componentName, opts = {}) {
  const { loading: LoadingComponent = () => null, hoc = (C) => C, callback = noop } = opts;

  return class DynamicComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {
        AsyncComponent: null,
      };
      this.load();
    }

    componentWillUnmount() {
      this.setState = noop;
    }

    load() {
      System.import(packageName)
        .then((m) => {
          const pgk = m.default || m;
          callback(pgk);
          const Comp = (componentName ? get(pgk, componentName) : pgk) || (() => null);
          this.setState({ AsyncComponent: Comp });
        })
        .catch(() => {});
    }

    render() {
      const { AsyncComponent } = this.state;

      if (AsyncComponent) {
        const Component = hoc(AsyncComponent);
        return <Component {...this.props} />;
      } else {
        return <LoadingComponent {...this.props} />;
      }
    }
  };
}
