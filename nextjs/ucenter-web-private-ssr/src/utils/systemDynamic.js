/**
 * Owner: willen@kupotech.com
 */
import { get, noop } from 'lodash-es';
import React from 'react';

export default function (packageName, componentName, opts = {}) {
  const { loading: LoadingComponent = () => null, hoc = (C) => C, callback = noop } = opts;

  return class DynamicComponent extends React.PureComponent {
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
        .catch((error) => {
          console.log(error);
        });
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
