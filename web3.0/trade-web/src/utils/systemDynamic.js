/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { get, noop } from 'lodash';

export default function (packageName, componentName, opts = {}) {
  const {
    hoc = C => C,
    callback = noop,
    loading: LoadingComponent = () => null,
  } = opts;

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
      Systemjs.import(packageName)
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
