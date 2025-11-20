/**
 * Owner: borden@kupotech.com
 */
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  unstable_handleError() {
    this.setState({
      hasError: true,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.log('error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return null;
    }
    return this.props.children;
  }
}
