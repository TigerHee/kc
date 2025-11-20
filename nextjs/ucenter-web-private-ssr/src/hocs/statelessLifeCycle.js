/**
 * Owner: willen@kupotech.com
 */
/**
 * 针对stateless组件获取初始化数据，以前在subscriptions里面监听路由发起请求，现在移植到这里添加生命周期
 * runtime: browser
 */
import React from 'react';
import { connect } from 'react-redux';

export default ({
  handleMounted = () => {},
  handleUpdated = () => {},
  handleWillUnmount = () => {},
}) =>
  (WrappedComponent) => {
    @connect()
    class StatelessLifeCycle extends React.Component {
      componentDidMount() {
        handleMounted(this.props);
      }

      componentDidUpdate(prevProps) {
        handleUpdated(this.props, prevProps);
      }

      componentWillUnmount() {
        handleWillUnmount(this.props);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    return StatelessLifeCycle;
  };
