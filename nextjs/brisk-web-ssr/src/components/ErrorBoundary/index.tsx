import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
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
    try {
      Sentry.captureEvent({
        message: error?.message,
        level: 'error',
        tags: {
          errorType: 'error_boundary',
        },
        contexts: {
          react: {
            componentStack: errorInfo?.componentStack,
          },
        },
        extra: {
          // 额外的调试信息
          errorName: error?.name,
          errorMessage: error?.message,
          errorStack: error?.stack,
          errorInfo: errorInfo?.componentStack,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
