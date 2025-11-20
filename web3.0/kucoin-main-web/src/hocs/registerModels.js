/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import SingletonRegisterModel from 'tools/SingletonRegisterModel';

const __singletonRegisterModel__ = new SingletonRegisterModel();

function registerModels(WrappedComponent) {
  class RegisterModels extends React.PureComponent {
    constructor(props) {
      super(props);
      __singletonRegisterModel__.register();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return RegisterModels;
}

export default registerModels;
