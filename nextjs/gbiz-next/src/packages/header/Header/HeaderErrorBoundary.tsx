/**
 * Header 错误边界组件
 * 防止header组件内部异常导致全屏白屏
 */
import React, { Component, ReactNode } from 'react';
import { sentryReport } from './tools';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class HeaderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新state，下次渲染将显示fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 更新state存储错误信息
    this.setState({
      errorInfo,
    });

    sentryReport({
      message: error?.message,
      level: 'error',
      tags: {
        errorType: 'header_error_boundary',
      },
      extra: {
        errorInfo: errorInfo?.componentStack,
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div />
      );
    }

    return this.props.children;
  }
}

export default HeaderErrorBoundary;
